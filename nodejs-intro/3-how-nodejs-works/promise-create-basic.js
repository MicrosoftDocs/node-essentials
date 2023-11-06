// Create a basic promise function
function promiseFunction() {
    return new Promise((resolve, reject) => {

        // do something

        if(error){
            // indicate success
            reject(error)
        } else {
            // indicate error
            resolve(data)
        }
    })
}

// Call a basic promise function
promiseFunction()
    .then((data) => {
        // handle success
    })
    .catch((error) => {
        // handle error
    })