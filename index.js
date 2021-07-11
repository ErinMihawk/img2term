const getPx = require('get-pixels');

getPx('input.png', (err, pixels) => {
    if (err) {
        console.error('Bad image path');
        return;
    }

    const w = pixels.shape[0];
    const h = pixels.shape[1];

    if (w > 80 || h > 48) {
        console.error('Image outside safe dimensions for terminal (80 x 48)');
        return;
    }

    if (h % 2 !== 0) {
        console.error('Image height must be a multiple of 2');
        return;
    }

    // Convert pixel data to binary array
    const bin = [];

    for (let i = 0; i < pixels.data.length; i += 4) {
        const r = pixels.data[i];
        const g = pixels.data[i + 1];
        const b = pixels.data[i + 2];
        const a = pixels.data[i + 3];

        if (r === 255) {
            bin.push(1);
        } else {
            bin.push(0);
        }
    }

    // Convert binary array to rows
    const rows = [];

    for (let i = 0; i < bin.length; i += w) {
        rows.push(bin.slice(i, i + w));
    } 

    // Converts rows to characters, grouping same index columns together to form pair characters
    const chars = [];

    for (let x = 0; x < rows.length; x += 2) {
        const arr = [];
        for (let y = 0; y < rows[x].length; y++) {
            const px1 = rows[x][y];
            const px2 = rows[x + 1][y];

            let char;

            switch (true) {
                case px1 == 0 && px2 == 0:
                    char = ' ';
                    break;
                case px1 == 1 && px2 == 1:
                    char = '█';
                    break;
                case px1 == 1 && px2 == 0:
                    char = '▀';
                    break;
                case px1 == 0 && px2 == 1:
                    char = '▄';
                    break;
            }
            arr.push(char);
        }
        chars.push(arr);
    }

    // Format character array into string
    let string = "";

    chars.forEach((x) => {
        string += x.join('') + "\n";
    });

    console.log(string);
});