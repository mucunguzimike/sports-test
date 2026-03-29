import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\NewsletterController::store
* @see app/Http/Controllers/NewsletterController.php:10
* @route '/newsletter/subscribe'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/newsletter/subscribe',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\NewsletterController::store
* @see app/Http/Controllers/NewsletterController.php:10
* @route '/newsletter/subscribe'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\NewsletterController::store
* @see app/Http/Controllers/NewsletterController.php:10
* @route '/newsletter/subscribe'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\NewsletterController::store
* @see app/Http/Controllers/NewsletterController.php:10
* @route '/newsletter/subscribe'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\NewsletterController::store
* @see app/Http/Controllers/NewsletterController.php:10
* @route '/newsletter/subscribe'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

const NewsletterController = { store }

export default NewsletterController