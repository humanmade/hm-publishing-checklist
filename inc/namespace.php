<?php

namespace HM\PublishingChecklist;

use HM\PublishingChecklist\Assets;

function init() {
	// add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\\enqueue_assets' );
	add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\\enqueue_assets' );
}

function enqueue_assets() {
	Assets\enqueue_script( [
		'handle'    => 'hm-publishing-checklist',
		'name'      => 'plugin-editor',
		'deps'      => [],
		// 'deps'      => [ 'wp-editor' ],
		'version'   => [],
		'build_url' => plugin_dir_url( dirname( __FILE__ ) ) . 'build',
		'build_dir' => plugin_dir_path( dirname( __FILE__ ) ) . 'build',
	] );

	Assets\enqueue_style( [
		'handle'    => 'hm-publishing-checklist',
		'name'      => 'plugin-style',
		'deps'      => [],
		'version'   => [],
		'build_url' => plugin_dir_url( dirname( __FILE__ ) ) . 'build',
		'build_dir' => plugin_dir_path( dirname( __FILE__ ) ) . 'build',
	] );
}
