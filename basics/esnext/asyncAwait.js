/**
 * @author Sven Koelpin
 */
const Database = {
    find(id){
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({data: id});
            }, 500);
        })
    }
};

//1. call Database.find with the ids 1, 2 and 3. Log each result. The next call can only be done when the previous call returned a value
const receiveDataInSequence = async () => {
    const one = await Database.find(1);
    console.log(one);
    const two = await Database.find(2);
    console.log(two);
    const three = await Database.find(3);
    console.log(three);
};

receiveDataInSequence();


//2. Do the same again, but let the calls run concurrently. Log the result
const receiveDataConcurrently = async () => {
    const result = await Promise.all([Database.find(1), Database.find(2), Database.find(3)]);
    console.log(result);
};
receiveDataConcurrently();

