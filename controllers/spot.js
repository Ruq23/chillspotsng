const Spot = require('../models/spot');
const { cloudinary } = require('../cloudinary')
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })


// const categories = ['Electronics', 'Gadgets', 'Clothing', 'Automobile', 'Furniture', 'Food']

module.exports.index = async (req, res) => {
    const spots = await Spot.find({});
    // console.log(iventories)
    res.render('spots/index', { spots });
}

module.exports.newProductForm = (req, res) => {
    res.render('spots/new')
}

module.exports.newProduct = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.spot.location,
        limit: 1
    }).send()
    const spot = new Spot(req.body.spot);
    spot.geometry = geoData.body.features[0].geometry;
    spot.image = req.files.map(f => ({ url: f.path, filename: f.filename })   )
    // res.send(req.files)
    spot.author = req.user._id
    await spot.save();
    console.log(spot)
    // res.send(spot)
    req.flash('success', 'Sucessfully Added Product to Inventory!');
    res.redirect(`/list/${spot._id}`)
}

module.exports.showProduct = async (req, res) => {
    const spot = await Spot.findById(req.params.id).populate({
        path: 'reviews',
        populate: { 
            path: 'author',
        }
    }).populate('author');
    const spotss = await Spot.aggregate([ { $sample: {size: 3} }]) 
    console.log(spotss)
    if(!spot){
        req.flash('error', 'Cannot find that product!');
        return res.redirect('/list')
    }
    res.render('spots/show_', { spot, spotss })
  }

module.exports.editProductForm = async (req, res) => {
    const spot = await Spot.findById(req.params.id)
    if (!spot) {
        req.flash('error', 'Cannot find that Product')
        return redirect ('/list')
    }
    res.render('spots/edit', { spot })
  }

module.exports.editProduct = async(req, res) => {
    const { id } = req.params
    console.log(req.body)
   const spot = await Spot.findByIdAndUpdate(id, { ...req.body.spot });
   const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
   spot.image.push(...imgs)
   await spot.save()
   if(req.body.deleteImages){
    // await inventory.updateOne({$pull: {image: {filename: {$in: req.body.deleteImages}}}})
    console.log('Bigg boyy')
   }
//    console.log(req.body.inventory)
   if(!spot){
    req.flash('error', 'Cannot find that product!');
    return res.redirect('/list')
   }
   req.flash('success', 'Sucessfully Updated a Product!');
   res.redirect(`/list/${spot._id}`)
}

module.exports.destroy = async(req, res) => {
    const { id } = req.params;
    await Spot.findByIdAndDelete(id);
   req.flash('success', 'Product Deleted!');
    res.redirect('/list');
}

