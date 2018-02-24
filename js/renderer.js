 const {ipcRenderer} = require('electron');
 
 // When main.js sends a folder-path message, update the text in html
 ipcRenderer.on('folder-path', function (event, arg) {
    document.getElementById("p1").innerHTML = arg;
})
 
 document.getElementById("filechoose").onchange = function() {
	 // send new chosen file path back to main
	 var filepath = this.files[0].path;
	 ipcRenderer.send('async-file-path',filepath);
 }
 
 // I'm not sure if this is the best way to notify main of completed load
 ipcRenderer.send('settings-loaded', 1);