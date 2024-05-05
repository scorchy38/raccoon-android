require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

const GITHUB_OWNER = 'Flying-Raccoon-AI';

app.get('*', async (req, res) => {
    try {
        const targetURL = `https://maven.pkg.github.com/${GITHUB_OWNER}/raccoon-android`;
        const response = await axios.get(targetURL, {
            headers: { 
                'Authorization': `token ${process.env.GH_TOKEN}`,
                'Host': 'maven.pkg.github.com'
            },
            validateStatus: function (status) {
                return status >= 200 && status < 303;
            },
            maxRedirects: 0
        });

        if (response.status === 302) {
            const redirectUrl = response.headers.location;
            res.redirect(302, redirectUrl);
        } else {
            res.set(response.headers);
            res.status(response.status).send(response.data);
        }
    } catch (error) {
        console.error(error);
        res.status(error.response ? error.response.status : 500).send(error.response ? error.response.data : 'Unknown error');
    }
});

const port = process.env.PORT || 80;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
