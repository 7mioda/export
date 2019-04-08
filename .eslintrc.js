module.exports = {
    "env": {
        "node": true,
        "jest": true,
        "es6": true
    },
    "extends": "airbnb-base",
    "parserOptions": {
        "sourceType": "module",
        "ecmaVersion": 8,
        "ecmaFeatures": {
        }
    },
    "rules": {
        "linebreak-style": 0,
        "no-console": 0,
        "no-await-in-loop": 0,
        "no-cond-assign": 0,
        "import/prefer-default-export": 0,
        "indent": [
            2,
            2,
            {
                "SwitchCase": 1
            }
        ],"no-underscore-dangle": ["error", { "allow": ["_id"] }],
        "max-len": [2, {"code": 250, "tabWidth": 4, "ignoreUrls": true}],
        "quotes": [
            "error",
            "single"
        ],
        "no-param-reassign": 0
    }
};
