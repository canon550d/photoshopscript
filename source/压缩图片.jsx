resizeJPG("E:\\文件盘\\我的图片\\2015-01-13\\33", "E:\\文件盘\\我的图片\\2015-01-13-min");

//
function resizeJPG(path, outputPath){
  var folder = new Folder(path);
  var list = folder.getFiles("*.jpg");
  //alert("图片数量，"+list.length);

  for(var i=0;i<list.length;i++){
    if(i<5){
      //alert(decodeURI(list[i]));
      var duckDoc = open(list[i]);

      //长边800
      duckDoc.resizeImage(800);

      var orientation = getTag(duckDoc.xmpMetadata.rawData.toString(), "Orientation");
      var angle = 0;
      if(orientation == 6){
        angle = 90;
      }else if(orientation == 8){
        angle = -90;
      }else if(orientation == 3){
        angle = 180;
      }
      duckDoc.rotateCanvas(angle);

      var e = duckDoc.info.exif;

      var newFile = new File (outputPath + "\\" + duckDoc.name);
/*
      exportOptions = new ExportOptionsSaveForWeb ();
      exportOptions.format = SaveDocumentType.JPEG;
      exportOptions.quality = 80;
      duckDoc.exportDocument(newFile, ExportType.SAVEFORWEB, exportOptions);
*/
      var option = new JPEGSaveOptions();
      option.quality = 10;//1到12
      option.embedColorProfile = true;
      option.formatOptions = FormatOptions.STANDARDBASELINE;
      option.matte = MatteType.NONE

      var white = new SolidColor();
      white.rgb.red = white.rgb.green = white.rgb.blue = 255;

      var nameLayer = duckDoc.artLayers.add();
      nameLayer.kind = LayerKind.TEXT;
      var TI = nameLayer.textItem;
      TI.position = [4,20];
      TI.font = "SimHei";
      TI.size = 16;
      TI.color = white;
      TI.contents = getValue(e, '日期时间');

      duckDoc.saveAs(newFile, option, true, Extension.LOWERCASE);

      duckDoc.close(SaveOptions.DONOTSAVECHANGES);
    }
  }
  alert("任务结束。");
}

function getValue(data, name){
  var val = "";
  for(var i=0;i<data.length;i++){
    val = data[i][0];
    if(val.indexOf(name)!=-1){
      return data[i][1];
    }
  }
  return val;
}

function getTag(data, name){
  var tag = "";
  var tempArray = explodeArray(data);
  for(var n=0; n<tempArray.length; n++){ 
    stringTemp = tempArray[n];
    if(stringTemp.indexOf(name)!=-1){ 
      tag = tempArray[n+1]; 
      break;
    }
  }
  return tag;
}

function explodeArray(item){
  var i=0;
  var Count=0; 
  var tempString = new String(item); 
  tempArray=new Array(1); 

  do{ 
		i=tempString.indexOf(":");
		if(i>0)
			tempString=tempString.substr(i+1,tempString.length-i-1);
		i=tempString.indexOf(">");
		if(i>0)	{
			tempArray[Count]=tempString.substr(0,i); 
			tempString=tempString.substr(i+1,tempString.length-i-1);
			Count ++;
		}
		i=tempString.indexOf("<");
		if(i>0) {
			tempArray[Count]=tempString.substr(0,i); 
			tempString=tempString.substr(i-1,tempString.length-i+1);
			Count ++;
		}
  }while (tempString.indexOf("</x:xmpmeta>")>0);

  tempArray[Count] = tempString; 
  return tempArray;
}