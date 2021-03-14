exports.NetworkMod = function edgeUI(mod) {
	//constructor(mod) {
	if (!global.TeraProxy.GUIMode)
		throw new Error('Proxy GUI is not running!');

	const { Host } = require('tera-mod-ui');
	const path = require("path")
	const buffsOverlays =[10155130,10155512,18817,100801];
	const supportedClazz =['glaiver','warrior'];
	
	let edgeUI = new Host(mod, 'warr.html', {
		title: 'edgeui',
		transparent: true,
		frame: false,
		alwaysOnTop: true,
		fullscreen: false,
		fullscreenable: false,
		skipTaskBar: false,
		width: 260,
		height: 120,
		resizable: false,
		center: true,
		x: mod.settings.windowPos.edgeUI[0],
		y: mod.settings.windowPos.edgeUI[1],
		autoHideMenuBar: true,
		titleBarStyle: 'hidden',
		webPreferences: {
			nodeIntegration: true,
			devTools: false
		}
	}, false, path.join(__dirname, 'ui'))

	let runeUI = new Host(mod, 'valk.html', {
		title: 'runeUI',
		transparent: true,
		frame: false,
		alwaysOnTop: true,
		fullscreen: false,
		fullscreenable: false,
		skipTaskBar: false,
		width: 250,
		height: 250,
		resizable: false,
		center: true,
		x: mod.settings.windowPos.runeUI[0],
		y: mod.settings.windowPos.runeUI[1],
		autoHideMenuBar: false,
		titleBarStyle: 'hidden',
		webPreferences: {
			nodeIntegration: true,
			devTools: false
		}
	}, false, path.join(__dirname, 'ui'));

	let overlay = undefined,
		curEdge = 0,
		openedClazz = '',
		focused = null,
		focusChange = true

	mod.game.on('enter_game', () => {
		if ( supportedClazz.includes(mod.game.me.class) ) {
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
			} else if ( openedClazz == 'glaiver' ) {
				mod.settings.scale.runeUI = parseFloat(arg2)
				overlay.send('edgeResize', { text: parseFloat(arg2)});
			} else {
				mod.settings.scale.edgeUI = parseFloat(arg2)
				overlay.send('edgeResize', { text: parseFloat(arg2)});
			}
		}
	})
	
	mod.hook('S_PLAYER_CHANGE_STAMINA', 1, (e) => {
		if ( !overlay || mod.game.me.class != 'glaiver' ) return;
		
		overlay.send('ragUpdate',e);
	});
		
	mod.hook('S_PLAYER_STAT_UPDATE', 14, (e) => {
		if (!mod.game.me.class == 'warrior' || !overlay || curEdge == e.edge) return
		
		curEdge = e.edge
		overlay.send('edgeUpdate', e)
	});
	
	mod.hook('S_WEAK_POINT', 1, {order: 1}, (e) => {
		if ( !overlay || mod.game.me.class != 'glaiver' ) return;
		
		if ( e.type == 2 ) {
			overlay.send('edgeUpdate', e )
		} else if ( e.target == mod.game.me.gameId && e.type == 0 ) {
			overlay.send('edgeUpdate', e )
		} else if ( e.type == 0 || e.type == 1 || (e.type == 3 && e.skill == 0 ) ) {
			overlay.send('edgeUpdate', e )
		} 
	});
	
	mod.hook('S_ABNORMALITY_BEGIN',3, {order: -1}, (e) => {
		if ( overlay && supportedClazz.includes(mod.game.me.class) && buffsOverlays.includes(e.id) ) {
			overlay.send('buffs',e);
		}
	});

	function spawnOverlay() {
		let openUI = null, pos = null,scale=0.65;
		
		if (mod.game.me.class == 'warrior') {
			mod.command.message(`EdgeUI set to Warrior Mode`);
			pos = mod.settings.windowPos.edgeUI;
			scale = mod.settings.scale.edgeUI;
			openUI = edgeUI;
		} else if (mod.game.me.class == 'glaiver') {
			mod.command.message(`EdgeUI set to Valk Mode`);
			pos = mod.settings.windowPos.runeUI;
			scale = mod.settings.scale.runeUI;
			openUI = runeUI;
		}

		openUI.show();
		//setTimeout(() => { mod.command.exec(`edgeui scale ${scale}`) }, 150)
		openUI.window.setPosition(pos[0], pos[1]);
		openUI.window.setAlwaysOnTop(true, 'screen-saver', 1);
		openUI.window.setVisibleOnAllWorkspaces(true);
		mod.setInterval(() => { overlay.window.moveTop() }, 500);
		openUI.window.on('close', () => {
			if (mod.game.me.class == 'warrior') {
				mod.settings.windowPos.edgeUI = openUI.window.getPosition();
			} else if (mod.game.me.class == 'glaiver') {
				mod.settings.windowPos.runeUI = openUI.window.getPosition();
			}
			mod.clearAllIntervals();
			overlay = undefined;
			curEdge = 0;
		});
		openedClazz = mod.game.me.class;

		return openUI;
	}
	
	this.destructor = () => {}
	this.saveState = () => {}
	this.loadState = state => {}
}

//}