<?php
/**
 * Detecting and load scripts from a theme or plugin `asset-manifest.json` file, to enable PHP to detect and load from
 * the  WebpackDevServer whenever that server is active.
 *
 * If no asset manifest is detected the `enqueue_webpack_dev_server_assets()` function will return `false`, permitting
 * theme and plugin code to manually handle their own enqueues while the development server is not running.
 *
 * Built off of https://github.com/humanmade/react-wp-scripts.
 *
 * @package RBMH_Asset_Loader
 */

namespace HM\PublishingChecklist\Assets;

/**
 * Register a single script.
 *
 * Automatically handles loading dev/build versions.
 *
 * @param array $args Script args.
 * @param string $build_dir Build directory.
 * @return void
 */
function register_script( $args ) {
	$args = wp_parse_args( $args, [
		'deps'      => [],
		'in_footer' => false,
		'build_dir' => '',
		'build_url' => '',
	] );

	$manifest = get_assets_manifest( $args['build_dir'] );

	wp_register_script(
		$args['handle'],
		get_asset_uri_by_name( $manifest, $args['name'], 'js', $args['build_url'] ),
		$args['deps'],
		false,
		$args['in_footer']
	);
}

/**
 * Register and enqueue a single script.
 *
 * Automatically handles loading dev/build versions.
 *
 * @param array $args Script args.
 * @param string $build_dir Build directory.
 * @return void
 */
function enqueue_script( $args ) {
	register_script( $args );
	wp_enqueue_script( $args['handle'] );
}

/**
 * Register a single script.
 *
 * Automatically handles loading dev/build versions.
 *
 * @param array $args Script args.
 * @param string $build_dir Build directory.
 * @return void
 */
function register_style( $args ) {
	$args = wp_parse_args( $args, [
		'deps'      => [],
		'build_dir' => '',
		'build_url' => '',
	] );

	$manifest = get_assets_manifest( $args['build_dir'] );
	$uri      = get_asset_uri_by_name( $manifest, $args['name'], 'css', $args['build_url'] );
	$is_dev   = pathinfo( $uri, PATHINFO_EXTENSION ) === 'js';

	wp_register_style(
		$args['handle'],
		$uri,
		$args['deps'],
		false
	);

	// In development, we need to load the style JS file whenever the style CSS is loaded.
	if ( $is_dev ) {
		add_action( 'style_loader_tag', function( $tag, $handle ) use ( $args, $uri ) {
			if ( $handle === $args['handle'] ) {
				$tag = sprintf( '<script src="%s"></script>', esc_url( $uri ) );
			}
			return $tag;
		}, 10, 2 );
	}
}

/**
 * Register and enqueue a single style.
 *
 * Automatically handles loading dev/build versions.
 *
 * @param array $args Script args.
 * @param string $build_dir Build directory.
 * @return void
 */
function enqueue_style( $args ) {
	register_style( $args );
	wp_enqueue_style( $args['handle'] );
}

/**
 * Helper function to find the asset URI.
 *
 * - If dev, returns the dev asset.
 * - Else returns the URL to the file in the build directory.
 *
 * @param string $asset_name Name of asset used in webpack config.
 * @param string $build_dir Build dir path. Assumes that asset manifest file is found here.
 * @return string Asset source URI.
 */
function get_asset_uri_by_name( array $manifest, string $asset_name, string $ext, string $build_url ) {
	// Try the correct flie type.
	$key = sprintf( '%s.%s', $asset_name, $ext );
	if ( isset( $manifest[ $key ] ) ) {
		return get_asset_path_or_uri( $manifest[ $key ], $build_url );
	}

	// Try JS files. e.g. for CSS files in development - use the JS version.
	$key = sprintf( '%s.js', $asset_name );
	if ( isset( $manifest[ $key ] ) ) {
		return get_asset_path_or_uri( $manifest[ $key ], $build_url );
	}

	return '';
}

/**
 * Attempt to read the asset manifest from a directory.
 *
 * @param string $directory Root directory possibly containing an `asset-manifest.json` file.
 * @return array Array of assets on success, else empty array.
 */
function get_assets_manifest( string $directory ) : array {
	$path = trailingslashit( $directory ) . 'asset-manifest.json';

	if ( ! file_exists( $path ) ) {
		return [];
	}

	$contents = file_get_contents( $path );

	if ( empty( $contents ) ) {
		return [];
	}

	return json_decode( $contents, true );
}

/**
 * Return web URIs or convert relative filesystem paths to absolute paths.
 *
 * @param string $asset_path A relative filesystem path or full resource URI.
 * @param string $base_url   A base URL to prepend to relative bundle URIs.
 * @return string Absolute path or URI to asset.
 */
function get_asset_path_or_uri( string $asset_path, string $base_url ) {
	if ( strpos( $asset_path, '://' ) !== false ) {
		return $asset_path;
	}

	return trailingslashit( $base_url ) . $asset_path;
}
