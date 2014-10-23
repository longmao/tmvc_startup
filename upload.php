<?php
	 $fileName = $_FILES['file']['name'];
	 function clearFile($path)  
	 {  
		if(!is_dir($path)) return;  
		$handle = opendir($path);  
		while(false !== ($file = readdir($handle)))  
		{  	
		    if($file != "upload.php") {
			   `rm -rf "$file"`;
			}
		}  
	}  
	if($fileName) { 
		clearFile("./"); 
		move_uploaded_file($_FILES["file"]["tmp_name"], $fileName);
		`unzip -xo "$fileName"`;
		unlink($fileName);
	}
	
	//$cmd = "tar cvf tempt-app.tar tempt-app";
	//exec($cmd, $array);
	//print_r($array);
	
		
	//$cmd = "tar -xvf tempt-app.tar";
	//exec($cmd, $array);
	//print_r($array);
	
	//unlink($fileName);
	//`rm -rf file.js`;
	echo "success";
	
	
	/*$rar_file=rar_open("static/assets.rar") or die("失败");
	$entries=rar_list($rar_file);
	foreach($entries as $entry){
		$entry->extract("static/");
	}
	rar_close($rar_file);
	unlink("static/".$fileName);*/
	
	/*zip解压方法*/
	/*$zip_filename = "assets.rar";
	$zip_filename = key_exists(zip, $_GET) && $_GET[zip]?$_GET[zip]:$zip_filename;
	$zip_filepath = str_replace('\/', "/", dirname(__FILE__)) . "/" . $zip_filename;
	if(!is_file($zip_filepath))
	{
		die("文件".$zip_filepath."不存在!");
	}
	$zip = new ZipArchive();
	$rs = $zip->open($zip_filepath);
	if($rs !== TRUE)
	{
		die("解压失败!Error Code:" . $rs);
	}
	$zip->extractTo("./");
	$zip->close();
	echo $zip_filename."解 压成功!";*/
?>