<meta name="viewport" content="width=300">

<?php

//var_dump($_POST);
$msg = "";

if ($_POST["tor"]=="An"){
	$msg = "Schalte Beleuchtung Tor ein.";	
	exec("./tor.sh an");
	sleep(1);
} elseif ($_POST["tor"]=="Aus") {
	$msg = "Schalte Beleuchtung Tor aus.";
	exec("./tor.sh aus");
	sleep(1);
} elseif ($_POST["ver"]=="An") {
	$msg = "Schalte Beleuchtung Verwaltung ein.";
	exec("./verwaltung.sh an");
	sleep(1);
} elseif ($_POST["ver"]=="Aus") {
	$msg = "Schalte Beleuchtung Verwaltung aus.";
	exec("./verwaltung.sh aus");
	sleep(1);
} elseif ($_POST["lag"]=="An") {
	$msg = "Schalte Beleuchtung Lager ein.";
	exec("./lager.sh an");
	sleep(1);
} elseif ($_POST["lag"]=="Aus") {
	$msg = "Schalte Beleuchtung Lager aus.";
	exec("./lager.sh aus");
	sleep(1);
} 

if ($_POST["all"]=="+5"){
	$msg = "Schalte Beleuchtung in 5 Minuten aus.";	
	exec("./allesaus.sh +5min");
	sleep(1);
} elseif ($_POST["all"]=="+15") {
	$msg = "Schalte Beleuchtung  in 15 Minuten aus.";
	system("./allesaus.sh +15min");
	sleep(1);
} elseif ($_POST["all"]=="+30") {
	$msg = "Schalte Beleuchtung  in 30 Minuten aus.";
	system("./allesaus.sh +30min");
	sleep(1);
} elseif ($_POST["all"]=="+60") {
	$msg = "Schalte Beleuchtung  in 60 Minuten aus.";
	system("./allesaus.sh +60min");
	sleep(1);
} elseif ($_POST["all"]=="jetzt") {
	$msg = "Schalte Beleuchtung sofort aus.";
	system("./allesaus.sh");
	sleep(1);
}

$json = json_decode(file_get_contents("swstate.js"));
//var_dump($json);




//$json = json_encode($json);

?>

<script>
 //var state = JSON.parse('<?php  //echo $json; ?>');
</script>

<form action="" method="post">
	<p>Tor (<?php  echo $json->tor?"aus":"an"; ?>)<br>
		<input type="submit" name="tor" value="An"/>
		<input type="submit" name="tor" value="Aus"/>
	</p>
	<p>Verwaltung (<?php  echo $json->verwaltung?"aus":"an"; ?>)<br>
		<input type="submit" name="ver" value="An"/>
		<input type="submit" name="ver" value="Aus"/>
	</p>
	<p>Lager (<?php  echo $json->lager?"aus":"an"; ?>)<br>
		<input type="submit" name="lag" value="An"/>
		<input type="submit" name="lag" value="Aus"/>
	</p>
	<p>alles Aus in <br>
		<input type="submit" name="all" value="+5"/>
		<input type="submit" name="all" value="+15"/>
		<input type="submit" name="all" value="+30"/>
		<input type="submit" name="all" value="+60"/>
		<input type="submit" name="all" value="jetzt"/>
	</p>	
</form>

<?php echo $msg; ?>

<?php

// $bild1 = imagecreatefrompng ( "http://192.168.0.190:81/snapshot.jpg" );
// $bild2 = imagecreatefrompng ( "http://192.168.0.189:82/snapshot.jpg" );

?>

<!-- <img src="">
<img src=""> -->




