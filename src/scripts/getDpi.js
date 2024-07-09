
function pageLoad() {
    var obj = GetDisplaySize();

    target = document.getElementById("output");
    target.innerHTML = "ScreenWidth:" + obj.width + "</br>"
      + "ScreenHeight:" + obj.height + "</br>"
      + "availWidth:" + obj.availWidth + "</br>"
      + "availHeight:" + obj.availHeight + "</br>";
  }

  function GetDisplaySize()
  {
    // 解像度
    this.width = window.screen.width;
    this.height = window.screen.height;

    //有効画面サイズ
    this.availWidth = window.screen.availWidth;
    this.availHeight = window.screen.availHeight;

    return this;
  }
