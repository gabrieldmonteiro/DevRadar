const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

//-> index, show, store, update, destroy

module.exports = {
    //Listar Todos os Devs cadastrados na aplicacao
    async index(request,response){
        const devs = await Dev.find();
        return response.json(devs);
    },


    //Cadastrar Devs
    async store(request, response) {
        const { github_username, techs, latitude, longitude } = request.body;

        //Verificar se ja existe dev cadastrado -> Evitar dev duplicado
        let dev = await Dev.findOne({ github_username });
        if (!dev) {
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);

            const { name = login, avatar_url, bio } = apiResponse.data;

            techsArray = parseStringAsArray(techs);

            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };

            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location,
            })
        }

        return response.json(dev);
    }

};