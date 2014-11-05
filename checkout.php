<?php
	$cmd = "tar cvf tempt-app.tar *";
	exec($cmd, $array);
	print_r($array);
?>