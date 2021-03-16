document.addEventListener('DOMContentLoaded', () => {
  const { Renderer } = require('tera-mod-ui');
  let mod = new Renderer;
  let cachedTimeout = new Map();
  let cachedInterval = new Map();
  
  mod.on('edgeResize', (y) => {
    document.getElementById("mainBody").style.transform = `scale(${y.text})`; 
  })
  
  mod.on('edgeUpdate', (y) => {
	if ( y.hasOwnProperty('runemarksAdded') ) {
		switch (y.runemarksAdded) {
			case 0: {
				document.getElementById(`rune1`).style['fill'] = '#fdf9f9';
				document.getElementById(`rune2`).style['fill'] = '#fdf9f9';
				document.getElementById(`rune3`).style['fill'] = '#fdf9f9';
				document.getElementById(`rune4`).style['fill'] = '#fdf9f9';
				document.getElementById(`rune5`).style['fill'] = '#fdf9f9';
				document.getElementById(`rune6`).style['fill'] = '#fdf9f9';
				document.getElementById(`rune7`).style['fill'] = '#fdf9f9';
			} break;
			
			case 1: {
				document.getElementById(`rune1`).style['fill'] = '#EAAC43';
			} break;
			
			case 2: {
				document.getElementById(`rune1`).style['fill'] = '#EAAC43';
				document.getElementById(`rune2`).style['fill'] = '#EAAC43';
			} break;
			
			case 3: {
				document.getElementById(`rune1`).style['fill'] = '#EAAC43';
				document.getElementById(`rune2`).style['fill'] = '#EAAC43';
				document.getElementById(`rune3`).style['fill'] = '#EAAC43';
			} break;
			
			case 4: {
				document.getElementById(`rune1`).style['fill'] = '#EAAC43';
				document.getElementById(`rune2`).style['fill'] = '#EAAC43';
				document.getElementById(`rune3`).style['fill'] = '#EAAC43';
				document.getElementById(`rune4`).style['fill'] = '#EAAC43';
			} break;
			
			case 5: {
				document.getElementById(`rune1`).style['fill'] = '#EAAC43';
				document.getElementById(`rune2`).style['fill'] = '#EAAC43';
				document.getElementById(`rune3`).style['fill'] = '#EAAC43';
				document.getElementById(`rune4`).style['fill'] = '#EAAC43';
				document.getElementById(`rune5`).style['fill'] = '#EAAC43';
			} break;
			
			case 6: {
				document.getElementById(`rune1`).style['fill'] = '#EAAC43';
				document.getElementById(`rune2`).style['fill'] = '#EAAC43';
				document.getElementById(`rune3`).style['fill'] = '#EAAC43';
				document.getElementById(`rune4`).style['fill'] = '#EAAC43';
				document.getElementById(`rune5`).style['fill'] = '#EAAC43';
				document.getElementById(`rune6`).style['fill'] = '#EAAC43';
			} break;
			
			case 7: {
				document.getElementById(`rune1`).style['fill'] = '#EAAC43';
				document.getElementById(`rune2`).style['fill'] = '#EAAC43';
				document.getElementById(`rune3`).style['fill'] = '#EAAC43';
				document.getElementById(`rune4`).style['fill'] = '#EAAC43';
				document.getElementById(`rune5`).style['fill'] = '#EAAC43';
				document.getElementById(`rune6`).style['fill'] = '#EAAC43';
				document.getElementById(`rune7`).style['fill'] = '#FFB7B2';
			} break;
		}
	} else if ( y.hasOwnProperty('isWarrior') && y.isWarrior ) {
		document.getElementById("edgeNum").innerHTML = `<b>${y.edge}</b>`;
		if ( y.edge == 0 ) {
			document.getElementById('edgeBar').style['stroke'] = '#fabd2f';
			document.getElementById('edgeBar').setAttribute('x2','0%');
		} else {
			if ( y.edge == 10 ) document.getElementById('edgeBar').style['stroke'] = '#f01934';
			document.getElementById('edgeBar').setAttribute('x2',y.edge*10+'%');
		}
	} else if ( y.hasOwnProperty('isSorcerer') && y.isSorcerer ) {
		document.getElementById("lightningEdge").style['fill'] = y.lightningEdge > 0 ? '#cb68db' : '#fdf9f9';
		document.getElementById("iceEdge").style['fill'] = y.iceEdge > 0 ? '#228ae6' : '#fdf9f9';
		document.getElementById("fireEdge").style['fill'] = y.fireEdge > 0 ? '#f4483f' : '#fdf9f9';
	}
  })
  
  mod.on('buffs',(buff) => {
	  if ( buff.isActive ) {
		  document.getElementById(buff.id).style.display = 'inline';
		  let buffDuration = ((buff.duration % 60000) / 1000).toFixed(0);
		  document.getElementById('t'+buff.id).innerHTML=buffDuration;
		  
		  // reset skill handling
		  if ( cachedInterval.has(buff.id) ) {
			clearInterval(cachedInterval.get(buff.id));
			cachedInterval.delete(buff.id);
		  }
		  
		  let buffDurationInterval = setInterval( () => {
			  buffDuration -=1
			  if ( buffDuration >= 0 ) document.getElementById('t'+buff.id).innerHTML = buffDuration;
			  if ( buffDuration == 0 ) {
				  document.getElementById(buff.id).style.display = 'none';
				  cachedInterval.delete(buff.id)
				  clearInterval(buffDurationInterval);
			  }
		  },980);
		  
		  cachedInterval.set(buff.id, buffDurationInterval);
	  } else {
		for (const [buffId, interval] of cachedInterval.entries()) {
			document.getElementById(buffId).style.display = 'none';
			clearInterval(interval);
		}
		cachedInterval.clear();
	  }
  });
  
  mod.on('trifusion',(trifusion) => {
	if (cachedTimeout.has(trifusion.id) ) {
		clearTimeout(cachedTimeout.get(trifusion.id));
		cachedTimeout.delete(trifusion.id);
	}
	
	if ( trifusion.duration > 0 ) {
		document.getElementById(trifusion.id).style.display = 'none';
		let timeoutFuture = setTimeout(()=>{
			document.getElementById(trifusion.id).style.display = 'inline';
			cachedTimeout.delete(trifusion.id);
		},trifusion.duration);
		
		cachedTimeout.set(trifusion.id,timeoutFuture);
	} else {
		document.getElementById(trifusion.id).style.display = 'inline';
	}
  });
})
