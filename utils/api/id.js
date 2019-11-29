
const idToNumber = (id) => {
	return id.replace(/\D/g,'');
} 

module.exports = { idToNumber }