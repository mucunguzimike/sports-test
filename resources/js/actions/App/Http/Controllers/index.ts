import BlogController from './BlogController'
import NewsletterController from './NewsletterController'
import Admin from './Admin'
import ContactController from './ContactController'
import Settings from './Settings'

const Controllers = {
    BlogController: Object.assign(BlogController, BlogController),
    NewsletterController: Object.assign(NewsletterController, NewsletterController),
    Admin: Object.assign(Admin, Admin),
    ContactController: Object.assign(ContactController, ContactController),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers