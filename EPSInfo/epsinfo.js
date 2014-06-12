var epsInfo = {
	'parseHeader': function(imgObj) {
		if (imgObj.constructor.name == 'EPS') { 
			var f = new File(imgObj.itemLink.filePath); // InDesign
		} else if (imgObj.constructor.name == 'PlacedItem') {
			var f = new File(imgObj.file); // Illustrator
		} else {
			return [];
		}
		if (!f.open("r")) return [];
		for (var i=0; i<500; i++) {
			var line = f.readln();
			if (line.indexOf("%%Creator", 0) != -1) {
				var creator = line.slice(10);
			} else if (line.indexOf("%%HiResBoundingBox", 0) != -1) {
				var hrbbParams = line.split(" ");
			} else if (line.indexOf("%ImageData", 0) != -1) {
				var idParams = line.split(" ");
				break;
			}
		}
		f.close();
		return [creator, hrbbParams, idParams];
	},

	'getMode': function(imgObj) {
		var headerObj = this.parseHeader(imgObj);
		if (!headerObj[2]) return;
		var idParams = headerObj[2];
		switch(idParams[4]) {
			case "4":
				return "CMYK";
				break;
			case "3":
				return "RGB";
				break;
			case "2":
				return "Lab";
				break;
			case "1":
				return (idParams[3] == 1) ? "1bit" : "Gray";
				break;
			default:
				return;
		}
	},

	'getEncoding': function(imgObj) {
		var headerObj = this.parseHeader(imgObj);
		if (!headerObj[2]) return;
		var idParams = headerObj[2];
		switch(idParams[7]) {
			case "7":
				return "ASCII85";
				break;
			case "6":
				return "JPEG:Max";
				break;
			case "5":
				return "JPEG:High";
				break;
			case "4":
				return "JPEG:Mid";
				break;
			case "3":
				return "JPEG:Low";
				break;
			case "2":
				treturn "ASCII";
				break;
			case "1":
				return "Binary";
				break;
			default:
				return;
		}
	},

	'getPpi': function(imgObj) {
		var headerObj = this.parseHeader(imgObj);
		if (!headerObj[1] || !headerObj[2]) return;
		var hrbbParams = headerObj[1];
		var idParams = headerObj[2];
		var pt_x = hrbbParams[3];
		//var pt_y = hrbbParams[4];
		var px_x = idParams[1];
		//var px_y = idParams[2];
		return (px_x / pt_x * 72).toFixed(1);
	},

	'getCreator': function(imgObj) {
		var headerObj = this.parseHeader(imgObj);
		return headerObj[0] ? headerObj[0] : undefined;
	},

	'getAll': function(imgObj) {
		return {
			'creator': this.getCreator(imgObj),
			'mode': this.getMode(imgObj),
			'encoding': this.getEncoding(imgObj),
			'ppi': this.getPpi(imgObj)
		}
	}
}
