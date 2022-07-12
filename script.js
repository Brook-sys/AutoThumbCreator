var n = 0, wnd;
var hasobb = true, version = "1.0";
var firstload = true;
var nomecamadaFundo,nomecamadaIcon;
var autosave = false;
      
function iframeLoaded(pp) {
    wnd = pp.contentWindow;
    window.addEventListener("message", ppReady);
}
function ppReady(e) {
    console.log(e);
    
    if (e.data == "done") {
        n++;
        if(n==1) {
            // Depois de abrir o Photopea... mandando o padrao.psd
            var request = new XMLHttpRequest();
            request.open("GET", "padrao.psd", true);
            request.responseType = "arraybuffer";
            request.onload = loaded;
            request.send();
        } else if(n==2){
            // Depois de abrir o padrao.psd, habilitando o botao
            if(firstload){
                document.getElementById("btn-submit").removeAttribute("disabled");
            }else if(!firstload){
                sendtheObbeVersion();
            }
            
        }else if(n==3){
            // Enviado o script OBB e Version.

            document.getElementById("btn-submit").setAttribute("disabled","true");
            sendtheUploadImageFundo()
        }else if(n==4){
            // Enviado o script de Upload da imagem de fundo.
            sendtheConfigImageFundo();
        }else if(n==5){
            // Enviado o script de Configuração da imagem de fundo.
            sendtheUploadImageIcone()
        }else if(n==6){
            // Enviado o script de Upload da imagem de Icone.
            sendtheConfigImageIcone()
        }else if(n==7){
            // Enviado o script de Configuração da imagem de Icone.

            //Salvamento Geral
            wnd.postMessage("app.activeDocument.saveToOE(\"png\")","*");
        }else if(n==8){
            // Enviado o script de Salvamento da Imagem geral.
            n=0;
        }
    }else if(typeof e.data == 'object'){
        console.log(e.data);
        var url = URL.createObjectURL(arrayBufferToFile(e.data));
        showthepreview(url)
        if(autosave) savethepreview(url);
        document.getElementById("btn-submit").removeAttribute("disabled");
    }
}
function loaded(e) {
    var ab = e.target.response;  // ArrayBuffer
    wnd.postMessage(ab, "*");
}

var optionIcon="local",optionBack="local";
function optchanged(p){
    if(p.name=="opt-back"){
        k = document.getElementById("opt-backimage");
        k1 = document.getElementById("opt-backimagelink");
        switch(p.value){
            case "local":
                optionBack="local";
                k.style="display:inline;";
                k1.style="display:none;";
                break;
            case "online":
                optionBack="online";
                k.style="display:none;"
                k1.style="display:inline;"
                break;
        }
    }else if(p.name=="opt-icon"){
        k = document.getElementById("opt-iconimage");
        k1 = document.getElementById("opt-iconimagelink");
        switch(p.value){
            case "local":
                optionIcon="local";
                k.style="display:inline;";
                k1.style="display:none;";
                break;
            case "online":
                optionIcon="online";
                k.style="display:none";
                k1.style="display:inline";
                break;
        }
    }else if(p.name == "showphotopea"){
        if(p.checked){
            document.getElementById("photopea").style="display:inline;";
        }else if(!p.checked){
            document.getElementById("photopea").style="display:none;";
        }
    }else if(p.name == "showresult"){
        if(p.checked){
            document.getElementById("preview-image").style="display:inline;";
        }else if(!p.checked){
            document.getElementById("preview-image").style="display:none;";
        }
    }else if(p.name == "autosaveresult"){
        if(p.checked){
            autosave = true;
        }else if(!p.checked){
            autosave = false;
        }
    }
}
function create(){
    //-------------------------------- DEBUG 
    /*
    optionBack="";
    optionIcon="";
    //-------------------------------- DEBUG */
    document.getElementById("savepreview").setAttribute("disabled", "true");
    if(!tudoOK()) return;
    if(firstload){
        firstload=false;
        sendtheObbeVersion()
    }else if(!firstload){
        var photopea =  document.getElementById("photopea");
        photopea.src = photopea.src; 
    }
    
    
}
function tudoOK(){

    // Verificação campo VERSION
    campoversion = document.getElementById("opt-version");
    if(campoversion.value == "" || campoversion.value == null){
        alertify.error("Versão faltando");
        campoversion.focus();
        return false;
    }

    // Verificação campo IMAGEM DE FUNDO
    campoimagemfundo = document.getElementById("opt-backimage");
    campoimagemfundolink = document.getElementById("opt-backimagelink");
    if(optionBack == "local"){
        if(campoimagemfundo.files.length === 0){
            alertify.error("Imagem de fundo faltando");
            campoimagemfundo.focus();
            return false;
        }
        
    }else if(optionBack == "online"){
        if(campoimagemfundolink.value == "" || campoimagemfundolink.value == null){
            alertify.error("Imagem de fundo faltando");
            campoimagemfundolink.focus();
            return false;
        }

    }

    // Verificação campo IMAGEM DO ICONE
    campoimagemicone = document.getElementById("opt-iconimage");
    campoimagemiconelink = document.getElementById("opt-iconimagelink");
    if(optionIcon == "local"){
        if(campoimagemicone.files.length === 0){
            alertify.error("Imagem do icone faltando");
            campoimagemicone.focus();
            return false;
        }
    }else if(optionIcon == "online"){
        if(campoimagemiconelink.value == "" || campoimagemiconelink == null){
            alertify.error("Imagem do icone faltando");
            campoimagemiconelink.focus();
            return false;
        }
    }
    return true;
}
function getbase64(file){
    return new Promise((resolve, eject) =>{
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => eject(error);
    });
}
function uploadImageReqOpt(imagesource){

    var myHeaders = new Headers();
        myHeaders.append("Authorization", "Client-ID 4da6b3355b71b8b");
        var formdata = new FormData();
        formdata.append("image", imagesource);
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };
    return requestOptions;
}
function uploadImageFundoImgur(requestOptions){
    fetch("https://api.imgur.com/3/image", requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result.data)
            var fundouploadscript = 'var layerREF2 = app.activeDocument.layers.getByName("Cor Fundo");app.activeDocument.activeLayer = layerREF2;app.open("'+ result.data.link +'",null,true);app.echoToOE("fundouploadscript")';
            nomecamadaFundo = result.data.id;
            wnd.postMessage(fundouploadscript, "*");
        })
        .catch(error => console.log('error', error));
}
function uploadImageIconImgur(requestOptions){
    fetch("https://api.imgur.com/3/image", requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result.data)
            var iconeuploadscript = 'var layerREF = app.activeDocument.layers.getByName("Download");app.activeDocument.activeLayer = layerREF;app.open("'+result.data.link+'",null,true);app.echoToOE("iconeuploadscript")';
            nomecamadaIcon = result.data.id;
            wnd.postMessage(iconeuploadscript, "*");
        })
        .catch(error => console.log('error', error));
}
function arrayBufferToFile(buffer){
    const blob =  new Blob([buffer], { type: 'application/octet-stream' });
    return new File([blob], "preview.png", { type: 'image/png' });
}
function showthepreview(url){
    
    var image = document.getElementById("preview-image");
    image.src = url;
    var btnsave = document.getElementById("savepreview");
    btnsave.removeAttribute("disabled");
    btnsave.addEventListener("click", function(){
        savethepreview(url);
    })

}
function savethepreview(url){
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style.display = "none";
    a.href = url;
    a.download = "thumb.png"
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
function sendtheObbeVersion(){
    version = document.getElementById("opt-version").value;
    hasobb = document.getElementById("opt-obb").checked;
    //Implementando OBB e VERSION
    var obbeversionscript = "var textobb = app.activeDocument.layerSets.getByName(\"Textos\").layers.getByName(\"textobb\");textobb.visible = "+hasobb.toString()+";app.activeDocument.layerSets.getByName(\"Textos\").layers.getByName(\"textversion\").textItem.contents = "+"'"+version+"'"+";app.echoToOE('obbeversionscript');";
    wnd.postMessage(obbeversionscript, "*");
}
function sendtheUploadImageFundo(){
    // Upload IMAGEM DE FUNDO
    var imgsrc;
    if(optionBack == "local"){
        filefundo = document.getElementById("opt-backimage").files[0];
        getbase64(filefundo).then(
            data => {
                uploadImageFundoImgur(uploadImageReqOpt(data.split(",")[1]));
            }
        );
    }else if(optionBack == "online"){
        imgsrc = document.getElementById("opt-backimagelink").value;
        uploadImageFundoImgur(uploadImageReqOpt(imgsrc));
    }

}
function sendtheConfigImageFundo(){
    // Configuração IMAGEM DE FUNDO
    var fundoconfigscript = 'var layerIc = app.activeDocument.artLayers.getByName("'+nomecamadaFundo+'");layerIc.opacity = 10;var tlarg = ((100 * app.activeDocument.width) / layerIc.bounds[2].value) | 0;var talt = ((100 * app.activeDocument.height) / layerIc.bounds[3].value) | 0;var cordx = 0;var cordy = 0;var doc = app.activeDocument;doc.resizeCanvas(doc.width,doc.height);layerIc.resize(tlarg,talt, AnchorPosition.TOPLEFT);layerIc.translate(cordx,cordy);app.echoToOE("fundoconfigscript")';
    setTimeout(function(){
        wnd.postMessage(fundoconfigscript, "*");
    },1000)
}
function sendtheUploadImageIcone(){
    // Upload IMAGEM ICON
    var imgsrcicon;
    if(optionIcon == "local"){
        fileicon = document.getElementById("opt-iconimage").files[0];
        getbase64(fileicon).then(
            data => uploadImageIconImgur(uploadImageReqOpt(data.split(",")[1]))
        );
    }else if(optionIcon == "online"){
        imgsrcicon = document.getElementById("opt-iconimagelink").value;
            uploadImageIconImgur(uploadImageReqOpt(imgsrcicon));
    }
}
function sendtheConfigImageIcone(){
    // Configuração IMAGEM ICONE
    var iconeconfigscript = 'var layerIc2 = app.activeDocument.artLayers.getByName("'+nomecamadaIcon+'");var tlarg = (((100 * 538) / layerIc2.bounds[2].value) | 0);var talt = (((100 * 538) / layerIc2.bounds[3].value) | 0);var cordx = (58 - layerIc2.bounds[0].value);var cordy = (90 - layerIc2.bounds[1].value);var doc = app.activeDocument;doc.resizeCanvas(doc.width,doc.height);layerIc2.resize(tlarg,talt, AnchorPosition.TOPLEFT);layerIc2.translate(cordx,cordy);app.echoToOE("iconeconfigscript");app.saveToOE("png")';
    setTimeout(function(){
        wnd.postMessage(iconeconfigscript, "*");
    },1000);
}