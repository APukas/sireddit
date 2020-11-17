import { withUrqlClient } from "next-urql";
import { NavBar } from "../components/NavBar";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";


const Index = () => {
  const [{ data }] = usePostsQuery();

  return (
    <>
      <NavBar />
      <div>Hello</div>
      {data ? data.posts.map(post => <div key={post.title}>{post.title}</div>) : <p>Loading...</p>}
    </>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index)
