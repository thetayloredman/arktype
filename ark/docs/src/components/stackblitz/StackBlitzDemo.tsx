import React, { useEffect, useState } from "react"
import {
	DEMO_ELEMENT_ID,
	createStackblitzDemo,
	type DemoProps
} from "./stackblitzGenerators/createStackblitzDemo.js"

export const StackBlitzDemo = (demoProps: DemoProps) => {
	const [isLoading, setIsLoading] = useState(true)
	useEffect(() => {
		createStackblitzDemo(demoProps).then(() => setIsLoading(false))
	}, [])
	return (
		<div style={{ display: "flex", width: "100%", height: 600 }}>
			{isLoading ? <LinearProgress /> : null}
			<div id={DEMO_ELEMENT_ID} />
		</div>
	)
}