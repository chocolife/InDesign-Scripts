/*
	epsObj は処理するEPS画像

	InDesignの場合はallGraphics等で得られるEPSオブジェクト
	Illustratorの場合はPlacedItemオブジェクトを渡す

*/

 //クリエータを得る
var creator = epsInfo.getCreator(epsObj);

//カラーモードを得る
var mode = epsInfo.getMode(epsObj);

 //エンコーディングを得る
var encoding = epsInfo.getEncoding(epsObj);

 //解像度を得る
var ppi = epsInfo.getPpi(epsObj);

//まとめて連想配列で得る
var epsInfoObj = epsInfo.getAll(epsObj);
