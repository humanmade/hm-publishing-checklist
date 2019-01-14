<?php
/*
Plugin Name: HM Publishing Checklist
Plugin URI: https://humanmade.com/
Description: HM Publishing Checklist
Version: 0.1.0
Author: Human Made Limited
Author URI: https://humanmade.com/
Text Domain: hm-publishing-checklist
Domain Path: /languages
*/

require_once __DIR__ . '/inc/namespace.php';
require_once __DIR__ . '/inc/assets.php';

add_action( 'plugins_loaded', 'HM\\PublishingChecklist\\init' );
