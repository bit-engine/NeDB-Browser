const {remote, ipcRenderer} = require('electron'),
	dialog = remote.dialog,
	NE = require('nedb'),
	path = require('path');
(function(){
	var App = can.Control.extend({
		defaults: { 
			view: './templates/main.ejs',
			sources: []
		 }
	},{
		init: function(element, options){

			var data = new can.Map({});
			if(options.sources){
				var newSources = [];
				for(let i=0; i<options.sources.length; i++){
					let current = options.sources[i];
					let pathSplited = current.split('/');
					let fileName = pathSplited[pathSplited.length-1].split('.')[0];
					newSources.push({
						name: fileName,
						path: current
					});
				}
				data.attr('sources',newSources);
			}else{
				data.attr('sources',[]);
			}
			this.data = data;
			can.view(options.view, data, function(html){
				element.html(html);
				element.sourceList = element.find('.listview-outlook');
			});
		},
		'#doOpenSource click': function(el, ev){
			var self = this;
			dialog.showOpenDialog({
				title: 'Select NeDB Source',
				properties: ['openFile','multiSelections']
			}, function(filesSelected){
				for(let i=0;i<filesSelected.length;i++){
					let current = filesSelected[i];
					let pathSplited = current.split('/');
					let fileName = pathSplited[pathSplited.length-1].split('.')[0];
					self.data.attr('sources').push({
						name: fileName,
						path: current
					});
				}
			});
		},
		'#doCreateSource click': function(el, ev){
			metroDialog.open('#create-dialog');
		},
		'a.list click': function(el, ev){
			console.log('source click');
			this.element.sourceList.find('.marked').removeClass('marked');
			el.addClass('marked');
			var index = el.index();


			var selectedSource = this.data.attr('sources').attr(index).attr();
			console.log('selectedSource ',selectedSource);
			var Source = new NE({
				filename: selectedSource.path
				//autoload: true
			});
			var self = this;
			Source.loadDatabase(function(err){
				console.log(err);
				Source.find({}, function(err, all){
					console.log('all from source ',err,all);
					var properties = [];
					var records = [];
					for(let i=0; i<all.length; i++){
						var cProps = Object.keys(all[i]);
						for(let j=0;j<cProps.length;j++){
							if(!properties.includes(cProps[j])){
								properties.push(cProps[j]);
							}
						}
					}
					properties = properties.sort(function(v1, v2){
						if(v1 < v2) return -1;
						if(v1 > v2) return 1;
						return 0;
					});
					if(properties.includes('_id')){
						properties.splice(properties.indexOf('_id'), 1);
						properties = ['_id'].concat(properties);
					}
					console.log('all properties found', properties);
					for(let i=0; i<all.length;i++){
						var cRecord = [];
						for(let j=0;j<properties.length;j++){
							cRecord.push(all[i][properties[j]] ? all[i][properties[j]] : '-');
						}
						records.push(cRecord);
					}
					console.log('all records found ',records);
					self.data.attr('currentSource', selectedSource.name);
					self.data.attr('properties',properties);
					self.data.attr('records', records);

				});


			});

			
			

		}
	});
	var appState = new App(
		'#App',
		{ sources: remote.getCurrentWindow().initialSources }
	);

})(this);