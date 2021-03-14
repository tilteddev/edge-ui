document.addEventListener('DOMContentLoaded', () => {
  const { Renderer } = require('tera-mod-ui');
  let mod = new Renderer;

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
	} else if ( y.hasOwnProperty('edge')) {
		document.getElementById("edgeNum").innerHTML = `<b>${y.edge}</b>`;
		if ( y.edge == 0 ) {
			document.getElementById('edgeBar').style['stroke'] = '#fabd2f';
			document.getElementById('edgeBar').setAttribute('x2','0%');
		} else {
			if ( y.edge == 10 ) document.getElementById('edgeBar').style['stroke'] = '#f01934';
			document.getElementById('edgeBar').setAttribute('x2',y.edge*10+'%');
		}
	}  
  })
  
  mod.on('buffs',(buff) => {
	  document.getElementById(buff.id).style.display = 'inline';
	  setTimeout(()=>{document.getElementById(buff.id).style.display = 'none'},buff.duration);
  })
})
