const fs = require('fs');
module.exports = {
    devServer: {
        port: 80,
        disableHostCheck: false,
      //  hotOnly: false,
      //  port: '800',
        https: false,
    //    key: fs.readFileSync('kitani55.co.jp.key'),
     //   cert: fs.readFileSync('kitanisvrcert.crt'),
        public: 'http://localhost:80/',
      //  public: 'https://localhost:800/',
//        public: 'https://ec2-18-180-43-143.ap-northeast-1.compute.amazonaws.com:800/',
  //      ca: fs.readFileSync('cacert.cer'),
        requestCert: false,
//        //rejectUnauthorized: true
    },
};