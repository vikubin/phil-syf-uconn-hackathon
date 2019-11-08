

module.exports = {
    /**
     * Render a page
     * @param req
     * @param res
     * @param params
     * @param template
     * @param layout
     */
    render(req, res, params = {}, template, layout = "external"){
        console.log('utils => rendering with Params: ', params, '\nTemplate: ', template, '\nLayout:', layout);
        let context = params.data || {};
        context.layout = layout || 'external';
        res.render(template,context);
    }
};