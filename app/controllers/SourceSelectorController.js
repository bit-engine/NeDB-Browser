const electron = require('electron'),
	dialog = electron.remote.dialog,
	ipcRenderer = electron.ipcRenderer;
(function(){

	$('#doExit').click(function(ev){
		console.log('exit the browser');
	});

	$('#doSelectFile').click(function(ev){
		console.log('select a file');
		dialog.showOpenDialog({
			title: 'Select NeDB Source',
			properties: ['openFile','multiSelections']
		}, function(filesSelected){
			console.log(filesSelected);
			ipcRenderer.send('source-selected',filesSelected);	
		});
	});

})(this);