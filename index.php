<?php include("data.php"); ?>
<!DOCTYPE html>
<html lang="en"><head>
<meta http-equiv="content-type" content="text/html; charset=UTF-8">
        <meta charset="utf-8">
        <title>Mooey's Solar System Simulation -- Modified</title>
        <link rel="stylesheet" href="css/main.css" type="text/css" media="screen">
        <link type="text/css" href="css/jquery-ui-1.css" rel="stylesheet">
		<link type="text/css" href="css/vader/jquery-ui-1.8.16.custom.css" rel="stylesheet" />	
        <script type="text/javascript" src="js/jquery-1.6.2.min.js"></script>
        <script type="text/javascript" src="js/jquery-ui-1.8.16.custom.min.js"></script>
        <script type="text/javascript" src="js/raphael-min.js"></script>
        <script type="text/javascript" src="js/jquery.qtip-1.0.0-rc3.min.js"></script>
        <script type="text/javascript" src="js/interface.js"></script>
        <script type="text/javascript" src="js/simulate.js"></script>
        <script type="text/javascript" src="js/animate.js"></script>
        <script type="text/javascript" charset="utf-8">
            Raphael("holder", 800, 600, function () {
                init(this);
                go(this);
            });
        </script>
    </head>

<body>

<div id="wrapper">
<?php
?>
	<div id="description" title="The Solar System">
		<!-- Tabs -->
		<div id="tabs">
			<ul>
				<li><a href="#0">The Sun</a></li>
				<li><a href="#1">Mercury</a></li>
				<li><a href="#2">Venus</a></li>
				<li><a href="#3">Earth</a></li>
				<li><a href="#4">Mars</a></li>
				<li><a href="#5">Jupiter</a></li>
				<li><a href="#6">Saturn</a></li>
				<li><a href="#7">Uranus</a></li>
				<li><a href="#8">Neptune</a></li>
			</ul>
<?php
	$index = 0;
	foreach ($planetInfo as &$pl) {
		print "<div id='".$index."'>\n"; 
?>
				<table width="100%" cellspacing=0 cellpadding=2>
					<tr><td colspan=3 align="center"><a href="http://solarsystem.nasa.gov/planets/profile.cfm?Object=<?php print $pl['name']?>" target="_blank"><img class="tabimg" src="images/<?php print $pl['name']?>.jpg" /></a></td></tr>
<?php /*					<tr>
						<td>Distance from Earth</td>
						<td>149,597,900 km</td>
					</tr>*/ ?>
					<tr><td>Mean Radius</td><td><?php print printf('%3.2e',$pl['mean_radius']) ?> km</td><td><?php print printf('%3.2e',$pl['mean_radius']/$planetInfo[3]['mean_radius']); ?> of Earth's</td></tr>
					<tr><td>Volume</td><td><?php print printf('%3.2e',$pl['volume']) ?> km<sup>3</sup></td><td><?php print printf('%3.2e',$pl['volume']/$planetInfo[3]['volume']); ?> Earths</td></tr>
					<tr><td>Mass</td><td><?php print printf('%3.2e',$pl['mass']) ?> kg</td><td><?php print printf('%3.2e',$pl['mass']/$planetInfo[3]['mass']); ?> Earths</td></tr>
					<tr>
						<td colspan=3><a href="http://solarsystem.nasa.gov/planets/profile.cfm?Object=<?php print $pl['name']?>" target="_blank">Read More</a></td>
					</tr>
				</table>
<?php		
		print "</div>";
		$index++;
	}
?>	
		</div>
	</div>
	<div id="controls">
		<table cellpadding="2" cellspacing="0" width="100%"><tbody>
			<tr>
				<td width="50">Speed: </td>
				<td><div id="slider_speed"></div></td>
				<td width="50"><input value="35000" readonly="readonly" name="control_speed" id="control_speed" style="width: 50px; background: none repeat scroll 0% 0% rgb(102, 102, 102); border: 1px solid rgb(68, 68, 68); color: rgb(17, 17, 17);" type="text"></td>
			</tr>
			<tr>
				<td width="50">Zoom: </td>
				<td><div id="slider_zoom"></div></td>
				<td width="50"><input value="35000" readonly="readonly" name="control_zoom" id="control_zoom" style="width: 50px; background: none repeat scroll 0% 0% rgb(102, 102, 102); border: 1px solid rgb(68, 68, 68); color: rgb(17, 17, 17);" type="text"></td>
			</tr>
			<tr>
				<td colspan="3" align="center">
					<div id="control_checks">
						<input type="checkbox" name="control_description" id="control_description" /><label for="control_description">Show Description</label>
						<input type="checkbox" name="control_reverse" id="control_reverse" /><label for="control_reverse">Reverse Orbit</label>
					</div>
				</td>
			</tr>
		</tbody></table>
	</div>
</div>

<div id="holder"></div>
    
</body></html>
