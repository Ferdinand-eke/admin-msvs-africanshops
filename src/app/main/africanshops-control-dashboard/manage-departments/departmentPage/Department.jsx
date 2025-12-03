import FuseLoading from '@fuse/core/FuseLoading';
import FusePageCarded from '@fuse/core/FusePageCarded';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import _ from '@lodash';
import { FormProvider, useForm } from 'react-hook-form';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGetDepartmentById } from 'src/app/api/departments/useDepartments';
import DepartmentHeader from './DepartmentHeader';
import BasicInfoTab from './tabs/BasicInfoTab';
import ProductModel from './models/ProductModel';
/**
 * Form Validation Schema
 */
const schema = z.object({
	name: z.string().nonempty('You must enter a product name').min(5, 'The product name must be at least 5 characters')
});

/**
 * The product page.
 */
function Department() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const routeParams = useParams();
	const { productId } = routeParams;

	const {
		data: singleDepartment,
		isLoading,
		isError
	} = useGetDepartmentById(productId, {
		skip: !productId || productId === 'new'
	});

	const [tabValue, setTabValue] = useState(0);
	const methods = useForm({
		mode: 'onChange',
		defaultValues: {
			name: ''
		},
		resolver: zodResolver(schema)
	});
	const { reset, watch } = methods;
	const form = watch();
	useEffect(() => {
		if (productId === 'new') {
			reset(ProductModel({}));
		}
	}, [productId, reset]);
	useEffect(() => {
		if (singleDepartment?.data?.department) {
			reset({ ...singleDepartment?.data?.department });
		}
	}, [singleDepartment?.data?.department, reset]);

	/**
	 * Tab Change
	 */
	function handleTabChange(event, value) {
		setTabValue(value);
	}

	if (isLoading) {
		return <FuseLoading />;
	}

	/**
	 * Show Message if the requested products is not exists
	 */
	// if (isError && productId !== 'new') {
	// 	return (
	// 		<motion.div
	// 			initial={{ opacity: 0 }}
	// 			animate={{ opacity: 1, transition: { delay: 0.1 } }}
	// 			className="flex flex-col flex-1 items-center justify-center h-full"
	// 		>
	// 			<Typography
	// 				color="text.secondary"
	// 				variant="h5"
	// 			>
	// 				There is no such department!
	// 			</Typography>
	// 			<Button
	// 				className="mt-24"
	// 				component={Link}
	// 				variant="outlined"
	// 				to="/departments/list"
	// 				color="inherit"
	// 			>
	// 				Go to Departments Page
	// 			</Button>
	// 		</motion.div>
	// 	);
	// }

	/**
	 * Wait while product data is loading and form is setted
	 */
	if (
		_.isEmpty(form) ||
		(singleDepartment?.data?.department &&
			routeParams.productId !== singleDepartment?.data?.department.id &&
			routeParams.productId !== 'new')
	) {
		return <FuseLoading />;
	}

	return (
		<FormProvider {...methods}>
			<FusePageCarded
				header={<DepartmentHeader />}
				content={
					<>
						<Tabs
							value={tabValue}
							onChange={handleTabChange}
							indicatorColor="secondary"
							textColor="secondary"
							variant="scrollable"
							scrollButtons="auto"
							classes={{ root: 'w-full h-64 border-b-1' }}
						>
							<Tab
								className="h-64"
								label="Basic Info"
							/>
						</Tabs>
						<div className="p-16 sm:p-24 max-w-3xl">
							<div className={tabValue !== 0 ? 'hidden' : ''}>
								<BasicInfoTab />
							</div>
						</div>
					</>
				}
				scroll={isMobile ? 'normal' : 'content'}
			/>
		</FormProvider>
	);
}

export default Department;
