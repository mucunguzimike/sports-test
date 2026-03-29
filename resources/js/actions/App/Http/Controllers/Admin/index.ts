import DashboardController from './DashboardController'
import PostController from './PostController'
import CategoryController from './CategoryController'
import TagController from './TagController'
import MediaController from './MediaController'
import SettingsController from './SettingsController'

const Admin = {
    DashboardController: Object.assign(DashboardController, DashboardController),
    PostController: Object.assign(PostController, PostController),
    CategoryController: Object.assign(CategoryController, CategoryController),
    TagController: Object.assign(TagController, TagController),
    MediaController: Object.assign(MediaController, MediaController),
    SettingsController: Object.assign(SettingsController, SettingsController),
}

export default Admin