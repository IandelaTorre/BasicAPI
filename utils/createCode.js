const generateRandomCharacters = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let baseLength = characters.length;

    const randomArray = new Uint8Array(length);
    crypto.getRandomValues(randomArray);

    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = randomArray[i] % baseLength;
        result += characters.charAt(randomIndex);
    }
    return result;
}

export default generateRandomCharacters;