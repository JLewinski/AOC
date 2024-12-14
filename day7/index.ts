interface Calibration {
    finalValue: number;
    opperands: number[];
}

export default function main(input: string) {
    const lines = input.split('\r\n').map(line => ({
        finalValue: parseInt(line.match(/\d+(?=:)/g)?.[0] ?? '0'),
        opperands: line.matchAll(/\d+(?![\d:])/g).map(x => parseInt(x[0])).toArray()
    }));

    return lines.map(checkLine).reduce((a, b) => a + b);    
}

function checkLine(calibration: Calibration) {
    let results = [calibration.opperands[0]];
    for (let i = 1; i < calibration.opperands.length; i++) {
        results = results
            .map(x => [x + calibration.opperands[i], x * calibration.opperands[i], parseInt(x.toString() + calibration.opperands[i].toString())])
            .flat()
            .filter(x => x <= calibration.finalValue);
        
    }
    return results.includes(calibration.finalValue) ? calibration.finalValue : 0;
}