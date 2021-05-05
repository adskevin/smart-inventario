'use strict'
const Category = use('App/Models/Category')
const { validateAll } = use('Validator')

class CategoryController {
  async newcategory ({ request, session, response }) {
    const validation = await validateAll(request.all(), {
      description: 'required|min:3|max:254',
    });

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll()
      return response.redirect('/categories');
    }

    const category = new Category()
    category.description = request.input('description')
    await category.save()
    return response.redirect('/categories');
  }

  async categories ({ view, session }) {
    let categories = await Category.all();
    if (!categories) {
      return response.redirect('back');
    }
    return view.render('categories', { name: session.get('name'), categories: categories.toJSON() })
  }

  async editview ({ params, view, session }) {
    const category = await Category.find(params.id)
    return view.render('editcategory', { name: session.get('name'), category })
  }

  async deletecategory ({ params, response }) {
    const category = await Category.find(params.id)
    await category.delete()
    // Salva msg de sucesso
    // session.flash({ notification: 'Tarefa removida com sucesso!' })
    return response.redirect('back')
  }

  async editcategory ({ request, response }) {
    let id = request.input('id')
    let description = request.input('description')
    const category = await Category.find(id);
    if (!category) {
      return response.redirect('/categories');
    }
    category.description = description;
    await category.save();
    return response.redirect('/categories');
  }
}

module.exports = CategoryController
