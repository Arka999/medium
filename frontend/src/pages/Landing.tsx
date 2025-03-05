import { Link } from "react-router-dom";
import img from "../image/Blogging-scaled.jpg"

export const Landing = () => {
    return <div>
        <div className="border-b flex justify-between px-10 py-4">
            <div className="flex flex-col justify center font-semibold text-lg">
                Medium
            </div>
            <div className="pt-2  flex justify-end">
                <Link to="/signin" type="button" className="mr-4 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2">Signin</Link>
                <Link to="/signup" type="button" className="mr-4 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2">Get Started</Link>
            </div>
        </div>
             
        <div className="flex flex-col items-center ">
            <div className="flex justify-center ">
                <img  className="m-8"src={img} alt="image referenced from -Creator: Tashatuvango | Credit: tashatuvango - Fotolia"/>
            </div>
            <div className="flex justify-center text-3xl font-bold pt-2">
                A place to read, write, and deepen your understanding
            </div>
            <div className="flex justify-center text-2xl font-semibold pt-6">
                Simple, meet Flexible
            </div>
        </div>

    </div>     
}