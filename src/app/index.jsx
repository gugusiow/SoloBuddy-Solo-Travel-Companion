// entry page
import { model } from "/src/model.js"
import HomePresenter from "/src/presenters/homePresenter.jsx"

export default function IndexPage() {
    return <HomePresenter model={model} />
}