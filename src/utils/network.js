export function uploadSpeedUnitDetector(originalUploadSpeed) {
	let uploadSpeedUnit = null;
	let uploadSpeed = originalUploadSpeed;

	if (uploadSpeed < 1024) {
		uploadSpeedUnit = 'Kb/s';
	} else {
		uploadSpeed = uploadSpeed / 1024;
		uploadSpeedUnit = 'MB/s';
	}

	uploadSpeed = Math.round(uploadSpeed);

	return {
		uploadSpeedUnit,
		uploadSpeed,
	};
}

export function fileSizeUnitDetector(originalFileSize) {
	let fileSizeUnit = 'B';
	let fileSize = originalFileSize;

	if (fileSize < 1024 * 1024) {
		fileSize = fileSize / 1024;
		fileSizeUnit = 'KB';
	} else {
		fileSize = fileSize / (1024 * 1024);
		fileSizeUnit = 'MB';
	}

	fileSize = Math.round(fileSize);

	return {
		fileSizeUnit,
		fileSize,
	};
}
