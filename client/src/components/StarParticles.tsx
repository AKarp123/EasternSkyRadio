import { useState, useEffect, useMemo, memo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadStarsPreset } from "@tsparticles/preset-stars";


type properties = {
	children?: React.ReactNode;
}


const StarParticles = memo(({children}: properties) => {
	const [init, setInit] = useState(false);

	useEffect(() => {
		initParticlesEngine(async (engine) => {
			await loadStarsPreset(engine);
		}).then(() => {
			setInit(true);
		});
	}, []);


	const options = useMemo(
		() => ({
			fullScreen: {
				enable: true,
				zIndex: -1,
			},
			background: {
				color: {
					value: "#000",
				},
			},
			preset: "stars",
			fpsLimit: 16,
			pauseOnBlur: true,
		}),
		[]
	);
	if (init) {
		return (
			<>
				<Particles
					id="tsparticles"
					options={options}
				/>
				{children}
			</>
		);
	}

	return <>{children}</>;
});

export default StarParticles;
