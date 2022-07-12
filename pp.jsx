//VERSAO e OBB
var hasobb = true;
var textobb = app.activeDocument.layerSets.getByName("Textos").layers.getByName("textobb");
textobb.visible = hasobb;

var version = "v2.3.1.1.1.1";
app.activeDocument.layerSets.getByName("Textos").layers.getByName("textversion").textItem.contents = version;


//ICONE
var namee = "bVD7zOd";
try{
var layerIc2 = app.activeDocument.artLayers.getByName(namee);
var tlarg = (((100 * 538) / layerIc2.bounds[2].value) | 0);
var talt = (((100 * 538) / layerIc2.bounds[3].value) | 0);
var cordx = (58 - layerIc2.bounds[0].value);
var cordy = (90 - layerIc2.bounds[1].value);
var doc = app.activeDocument;
doc.resizeCanvas(doc.width,doc.height);
layerIc2.resize(tlarg,talt, AnchorPosition.TOPLEFT);
layerIc2.translate(cordx,cordy);
}catch(e){
var layerREF = app.activeDocument.layers.getByName("Download");
app.activeDocument.activeLayer = layerREF;
app.open("https://i.imgur.com/bVD7zOd.jpg",null,true);
}


//FUNDO
var namee = "DheeH8N";
try{
var layerIc = app.activeDocument.artLayers.getByName(namee);
layerIc.opacity = 10;
var tlarg = ((100 * app.activeDocument.width) / layerIc.bounds[2].value) | 0;
var talt = ((100 * app.activeDocument.height) / layerIc.bounds[3].value) | 0;
var cordx = 0;
var cordy = 0;
layerIc.resize(tlarg,talt, AnchorPosition.TOPLEFT);
layerIc.translate(cordx,cordy);
}catch(e){
var layerREF = app.activeDocument.layers.getByName("Cor Fundo");
app.activeDocument.activeLayer = layerREF;
app.open("https://i.imgur.com//DheeH8N.png",null,true);
}


var layerIc2 = app.activeDocument.artLayers.getByName("'+nomecamadaIcon+'");var tlarg = (((100 * 538) / layerIc2.bounds[2].value) | 0);var talt = (((100 * 538) / layerIc2.bounds[3].value) | 0);var cordx = (58 - layerIc2.bounds[0].value);var cordy = (90 - layerIc2.bounds[1].value);layerIc2.resize(tlarg,talt, AnchorPosition.TOPLEFT);//layerIc2.translate(cordx,cordy);
