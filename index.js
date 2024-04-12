const fs = require('fs')

const transactions = []
const arranged_tx = []

function readCSVFile(filePath) {
    try {
        const csvContent = fs.readFileSync(filePath, 'utf-8');

        // Process the CSV data (customize this part based on your needs)
        const lines = csvContent.split('\n');
        lines.forEach(line => {
            const values = line.split(',');

            let obj = {
                txid: values[0],
                fee: values[1],
                weight: values[2],
                parent: null,
            }

            if (values[3].length) {
                const splited = values[3].split(";");
                obj.parent = splited;
            }

            transactions.push(obj)
            // console.log(obj); // Displaying values in the console
        });

        // transactions.forEach((transaction) => {
        //     if(transaction.parent != '') {
        //         // console.log(transaction.parent)
        //         transaction.parent.split(';')
        //     }
        // })
    } catch (error) {
        console.error('Error reading CSV file:', error);
    }



    for (let i = 0; i < transactions.length; i++) {
        const tx = transactions[i];
        if (tx.parent) {
            for (let j = 0; j < tx.parent.length; j++) {
                const findParent = transactions.find(fd => fd.txid == tx.parent[j])

                if (findParent) {
                    arranged_tx.push(findParent);
                }
            }
        }else{
            arranged_tx.push(tx)
        }
    }

const stripped_duplicates = removeDuplicate(arranged_tx);

for (let index = 0; index < stripped_duplicates.length; index++) {
    const element = stripped_duplicates[index];

    fs.appendFile('test.txt',` ${element.txid}\n`, function (err) {
        if (err) {
          // append failed
        } else {
          // done
        }
      })
    
}

}



function removeDuplicate(transactions){
const stripped = transactions.filter((value,index,self) =>   index === self.findIndex((t) => (
    t.txid === value.txid
  )))

return stripped;
}

readCSVFile('mempool.csv');