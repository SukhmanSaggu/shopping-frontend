import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'

const DummyComp = () => {
    const [data, setData] = useState([])

    const [search, setSearch] = useState("")

    const [count, setCount] = useState(0)


    const fetchData = useCallback(() => {
        axios.get(`https://fakestoreapi.com/products/${count}`).then((res) => {
            setData(res.data)
        }).catch((err) => {
            console.log(err);
        })
    }, [search, count])



    useEffect(() => {
        fetchData()
    }, [search, count])

    return (
        <>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
            <button onClick={() => setCount(prev => prev + 1)}>Increase</button>
            <h1>{data?.title}</h1>
            <div style={{ background: "red" }}>{
                !!data?.length && data?.map((ele) => {
                    return <h3>{ele.id}. {ele.title}</h3>
                })
            }</div>
        </>
    )
}

export default DummyComp