<?php
// Force our Settings override globally (covers static references)
if (class_exists('App\Override\ProTeam\Settings')) {
    class_alias('App\Override\ProTeam\Settings', 'Inovector\Mixpost\Settings');
}
