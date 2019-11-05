
const msToHours = (timeInMs) => {
	return Number(timeInMs)/(1000*60*60);
}

const isRecordObsolete = (obj) => {
	const dateOfInsertion = obj && new Date(obj.dateOfInsertion);
	const currentDate = new Date();
	const hours = 1;

	return msToHours(currentDate-dateOfInsertion) > hours;
}

export default isRecordObsolete;