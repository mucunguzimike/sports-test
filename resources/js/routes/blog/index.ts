import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\BlogController::index
* @see app/Http/Controllers/BlogController.php:14
* @route '/blog'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/blog',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BlogController::index
* @see app/Http/Controllers/BlogController.php:14
* @route '/blog'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BlogController::index
* @see app/Http/Controllers/BlogController.php:14
* @route '/blog'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BlogController::index
* @see app/Http/Controllers/BlogController.php:14
* @route '/blog'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BlogController::index
* @see app/Http/Controllers/BlogController.php:14
* @route '/blog'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BlogController::index
* @see app/Http/Controllers/BlogController.php:14
* @route '/blog'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BlogController::index
* @see app/Http/Controllers/BlogController.php:14
* @route '/blog'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\BlogController::show
* @see app/Http/Controllers/BlogController.php:65
* @route '/blog/{post}'
*/
export const show = (args: { post: string | { slug: string } } | [post: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/blog/{post}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BlogController::show
* @see app/Http/Controllers/BlogController.php:65
* @route '/blog/{post}'
*/
show.url = (args: { post: string | { slug: string } } | [post: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { post: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { post: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            post: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        post: typeof args.post === 'object'
        ? args.post.slug
        : args.post,
    }

    return show.definition.url
            .replace('{post}', parsedArgs.post.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BlogController::show
* @see app/Http/Controllers/BlogController.php:65
* @route '/blog/{post}'
*/
show.get = (args: { post: string | { slug: string } } | [post: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BlogController::show
* @see app/Http/Controllers/BlogController.php:65
* @route '/blog/{post}'
*/
show.head = (args: { post: string | { slug: string } } | [post: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BlogController::show
* @see app/Http/Controllers/BlogController.php:65
* @route '/blog/{post}'
*/
const showForm = (args: { post: string | { slug: string } } | [post: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BlogController::show
* @see app/Http/Controllers/BlogController.php:65
* @route '/blog/{post}'
*/
showForm.get = (args: { post: string | { slug: string } } | [post: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BlogController::show
* @see app/Http/Controllers/BlogController.php:65
* @route '/blog/{post}'
*/
showForm.head = (args: { post: string | { slug: string } } | [post: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\BlogController::category
* @see app/Http/Controllers/BlogController.php:100
* @route '/category/{category}'
*/
export const category = (args: { category: string | { slug: string } } | [category: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: category.url(args, options),
    method: 'get',
})

category.definition = {
    methods: ["get","head"],
    url: '/category/{category}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BlogController::category
* @see app/Http/Controllers/BlogController.php:100
* @route '/category/{category}'
*/
category.url = (args: { category: string | { slug: string } } | [category: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { category: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { category: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            category: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        category: typeof args.category === 'object'
        ? args.category.slug
        : args.category,
    }

    return category.definition.url
            .replace('{category}', parsedArgs.category.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BlogController::category
* @see app/Http/Controllers/BlogController.php:100
* @route '/category/{category}'
*/
category.get = (args: { category: string | { slug: string } } | [category: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: category.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BlogController::category
* @see app/Http/Controllers/BlogController.php:100
* @route '/category/{category}'
*/
category.head = (args: { category: string | { slug: string } } | [category: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: category.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BlogController::category
* @see app/Http/Controllers/BlogController.php:100
* @route '/category/{category}'
*/
const categoryForm = (args: { category: string | { slug: string } } | [category: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: category.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BlogController::category
* @see app/Http/Controllers/BlogController.php:100
* @route '/category/{category}'
*/
categoryForm.get = (args: { category: string | { slug: string } } | [category: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: category.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BlogController::category
* @see app/Http/Controllers/BlogController.php:100
* @route '/category/{category}'
*/
categoryForm.head = (args: { category: string | { slug: string } } | [category: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: category.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

category.form = categoryForm

/**
* @see \App\Http\Controllers\BlogController::tag
* @see app/Http/Controllers/BlogController.php:119
* @route '/tag/{tag}'
*/
export const tag = (args: { tag: string | { slug: string } } | [tag: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tag.url(args, options),
    method: 'get',
})

tag.definition = {
    methods: ["get","head"],
    url: '/tag/{tag}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BlogController::tag
* @see app/Http/Controllers/BlogController.php:119
* @route '/tag/{tag}'
*/
tag.url = (args: { tag: string | { slug: string } } | [tag: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tag: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { tag: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            tag: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        tag: typeof args.tag === 'object'
        ? args.tag.slug
        : args.tag,
    }

    return tag.definition.url
            .replace('{tag}', parsedArgs.tag.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BlogController::tag
* @see app/Http/Controllers/BlogController.php:119
* @route '/tag/{tag}'
*/
tag.get = (args: { tag: string | { slug: string } } | [tag: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tag.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BlogController::tag
* @see app/Http/Controllers/BlogController.php:119
* @route '/tag/{tag}'
*/
tag.head = (args: { tag: string | { slug: string } } | [tag: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: tag.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BlogController::tag
* @see app/Http/Controllers/BlogController.php:119
* @route '/tag/{tag}'
*/
const tagForm = (args: { tag: string | { slug: string } } | [tag: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: tag.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BlogController::tag
* @see app/Http/Controllers/BlogController.php:119
* @route '/tag/{tag}'
*/
tagForm.get = (args: { tag: string | { slug: string } } | [tag: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: tag.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BlogController::tag
* @see app/Http/Controllers/BlogController.php:119
* @route '/tag/{tag}'
*/
tagForm.head = (args: { tag: string | { slug: string } } | [tag: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: tag.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

tag.form = tagForm

const blog = {
    index: Object.assign(index, index),
    show: Object.assign(show, show),
    category: Object.assign(category, category),
    tag: Object.assign(tag, tag),
}

export default blog