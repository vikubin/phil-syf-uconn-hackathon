

module.exports = {
    /**
     * Renders a page
     * @param req
     * @param res
     * @param {Object}  pageData    - Stuff to put on pg
     * @param {string}  template    - Page template
     * @param {string}  layout      - Layout
     */
    render(req, res, pageData = {}, template, layout = "external"){
        console.log('utils => rendering with Params: ', pageData, '\nTemplate: ', template, '\nLayout:', layout);
        let context = pageData || {};
        context.layout = layout || 'external';
        res.render(template,context);
    },
};