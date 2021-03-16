exports.NetworkMod = function edgeUI(mod) {
	//constructor(mod) {
	if (!global.TeraProxy.GUIMode)
		throw new Error('Proxy GUI is not running!');

	const { Host } = require('tera-mod-ui');
	const path = require("path")
	const buffsOverlays =[10155130,10155512,18817,100801,503061];
	
	const classesUI = {
		"glaiver": {
			settingsProp:'runeUI',
			overlay: createHost('valk.html','RuneUI',250,250,mod.settings.windowPos.runeUI[0],mod.settings.windowPos.runeUI[1])
		} ,
		"warrior": {
			settingsProp:'edgeUI',
			overlay: createHost('warr.html','EdgeUI',250,250,mod.settings.windowPos.edgeUI[0],mod.settings.windowPos.edgeUI[1])
		},
		"sorcerer": {
			settingsProp:'fusionUI',
			overlay: createHost('sorc.html','FusionUI',250,100,mod.settings.windowPos.fusionUI[0],mod.settings.windowPos.fusionUI[1])
		}
	}
	let overlay = undefined,
		curEdge = 0,
		openedClazz = '',
		focused = null,
		focusChange = true

	mod.game.on('enter_game', () => {
		if ( classesUI[mod.game.me.class] ) {
			mod.command.exec('edgeui');
		}
	});
	
	mod.game.on('leave_game', () => {
		if ( overlay ) {
			overlay.close();
		}
		mod.clearAllIntervals();
	})

	mod.command.add('edgeui', (arg, arg2) => {
		if (overlay && !arg && mod.game.me.class == openedClazz ) {
			overlay.close();
			overlay = undefined;
		} else if (overlay && !arg && !mod.game.me.class == openedClazz ) {
			overlay = spawnOverlay();
		} else if (!overlay && !arg || !overlay && ['open', 'gui', 'ui'].includes(arg)) {
			overlay = spawnOverlay();
		} else if (overlay && arg == 'scale') {
			if ( arg2 > 1 || arg2 < 0.5 ) {
				mod.command.message('Only 0.5 to 1 scaling is supported.');
			} else if ( classesUI[mod.game.me.class] ) {
				mod.settings.scale[classesUI[mod.game.me.class].settingsProp] = parseFloat(arg2)
				overlay.send('edgeResize', { text: parseFloat(arg2)});
			} 
		}
	})
	
	mod.hook('S_CREATURE_LIFE',3, (e) => {
		if ( !overlay || !classesUI[mod.game.me.class] ) return;
		
		if ( !e.alive ) overlay.send('buffs',{isActive:false});
	});
	
	mod.hook('S_PLAYER_CHANGE_STAMINA', 1, (e) => {
		if ( !overlay || mod.game.me.class != 'glaiver' ) return;
		
		overlay.send('ragUpdate',e);
	});
	
	mod.hook('S_START_COOLTIME_SKILL', 3, e=> {
		if ( !overlay || ( overlay && e.skill.id != 340230) ) return
		
		overlay.send('trifusion',{id:e.skill.id,duration:e.cooldown});
	});
	
	mod.hook('S_PLAYER_STAT_UPDATE', 14, (e) => {
		if ( !overlay || !classesUI[mod.game.me.class] ) return
		
		if ( mod.game.me.class == 'warrior' && curEdge != e.edge ) {
			e['isWarrior']=true;
			curEdge = e.edge;
			overlay.send('edgeUpdate', e);
		} else if ( mod.game.me.class == 'sorcerer' ) {
			e['isSorcerer']=true;
			overlay.send('edgeUpdate', e);
		} else {
			return;
		}
	});
	
	mod.hook('S_WEAK_POINT', 1, (e) => {
		if ( !overlay || mod.game.me.class != 'glaiver' ) return;
		
		if ( e.type == 2 ) {
			overlay.send('edgeUpdate', e )
		} else if ( e.target == mod.game.me.gameId && e.type == 0 ) {
			overlay.send('edgeUpdate', e )
		} else if ( e.type == 0 || e.type == 1 || (e.type == 3 && e.skill == 0 ) ) {
			overlay.send('edgeUpdate', e )
		} 
	});
	
	mod.hook('S_ABNORMALITY_BEGIN',3, (e) => {
		if ( !overlay || !classesUI[mod.game.me.class] || !buffsOverlays.includes(e.id) ) return
		
		overlay.send('buffs',{id:e.id,duration:parseInt(e.duration),isActive:true});			
	});
	
	mod.hook('S_ABNORMALITY_REFRESH',2, (e) => {
		if ( !overlay || !classesUI[mod.game.me.class]) return; 
		
		if ( e.id == 503061 ) overlay.send('buffs',{id:e.id,duration:parseInt(e.duration),isActive:true});
	});
	
	function spawnOverlay() {
		if ( !classesUI[mod.game.me.class] ) return;
		let openUI = classesUI[mod.game.me.class].overlay;
		
		openUI.show();
		mod.command.message(`UI set to ${classesUI[mod.game.me.class].settingsProp} Mode`);
		
		setTimeout(() => { mod.command.exec(`edgeui scale ${mod.settings.scale[classesUI[mod.game.me.class].settingsProp]}`) }, 150)
		openUI.window.setPosition(mod.settings.windowPos[classesUI[mod.game.me.class].settingsProp][0], mod.settings.windowPos[classesUI[mod.game.me.class].settingsProp][1]);
		openUI.window.setAlwaysOnTop(true, 'screen-saver', 1);
		openUI.window.setVisibleOnAllWorkspaces(true);
		mod.setInterval(() => { overlay.window.moveTop() }, 500);
		openUI.window.on('close', () => {
			mod.settings.windowPos[classesUI[openedClazz].settingsProp] = openUI.window.getPosition();
			mod.clearAllIntervals();
			overlay = undefined;
			curEdge = 0;
		});
		openedClazz = mod.game.me.class;

		return openUI;
	}
	
	function createHost(hostFile,title,w,h,x,y) {
		return new Host(mod, hostFile, {
			title: title,
			transparent: true,
			frame: false,
			alwaysOnTop: true,
			fullscreen: false,
			fullscreenable: false,
			skipTaskBar: false,
			width: w,
			height: h,
			resizable: false,
			maximizable:false,
			center: true,
			x: x,
			y: y,
			autoHideMenuBar: true,
			titleBarStyle: 'hidden',
			webPreferences: {
				nodeIntegration: true,
				devTools: false
			}
		}, false, path.join(__dirname, 'ui'));
	}
	
	this.destructor = () => {}
	this.saveState = () => {}
	this.loadState = state => {}
}

//}