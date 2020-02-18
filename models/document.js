module.exports=(sequelize,type)=>{
    return sequelize.define('document',{
        id:{
            type: type.INTEGER,
            primaryKey:true,
            autoIncrement: true
        },
        name:type.STRING,
        date:type.DATE,
        number_document: type.STRING,
        note: type.STRING,
        data: 
            type.BLOB('long'),
        type: type.STRING
          
    },
    {
        timestamps: false
      })
}