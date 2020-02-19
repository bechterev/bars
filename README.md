# bars
  Backend расположен в папке ./bars необходимо установить npm пакеты npm install.
Перед первым запуском необходимо в файле ./bars/sequelize.js изменить строку 25 с "sequelize.sync().then(()=>{"
на "sequelize.sync({force:true}).then(()=>{".
Старт node index.js

Fronend Angular, папка ui/bars.
Для frontend необходимо установить angular-cli в папке ui/bars командой npm install
СУБД postgres. Необходимо на локальной машине создать базу с именем bars.

 
