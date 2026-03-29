import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\NewsletterController::subscribe
* @see app/Http/Controllers/NewsletterController.php:10
* @route '/newsletter/subscribe'
*/
export const subscribe = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: subscribe.url(options),
    method: 'post',
})

subscribe.definition = {
    methods: ["post"],
    url: '/newsletter/subscribe',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\NewsletterController::subscribe
* @see app/Http/Controllers/NewsletterController.php:10
* @route '/newsletter/subscribe'
*/
subscribe.url = (options?: RouteQueryOptions) => {
    return subscribe.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\NewsletterController::subscribe
* @see app/Http/Controllers/NewsletterController.php:10
* @route '/newsletter/subscribe'
*/
subscribe.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: subscribe.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\NewsletterController::subscribe
* @see app/Http/Controllers/NewsletterController.php:10
* @route '/newsletter/subscribe'
*/
const subscribeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: subscribe.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\NewsletterController::subscribe
* @see app/Http/Controllers/NewsletterController.php:10
* @route '/newsletter/subscribe'
*/
subscribeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: subscribe.url(options),
    method: 'post',
})

subscribe.form = subscribeForm

const newsletter = {
    subscribe: Object.assign(subscribe, subscribe),
}

export default newsletter