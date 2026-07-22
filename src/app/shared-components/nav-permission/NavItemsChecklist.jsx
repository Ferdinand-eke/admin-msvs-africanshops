import { Controller, useFormContext } from 'react-hook-form';
import { Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material';
import navigationConfig from 'app/configs/navigationConfig';

/**
 * Checklist of every real (leaf) nav item id from navigationConfig.js,
 * grouped by their parent nav group — bound to a react-hook-form array
 * field (department/designation `allowedNavIds`). Added 2026-07-22 as the
 * actual UI for the department/designation nav-visibility RBAC design: an
 * admin picks exactly which screens a department (or, narrower, a
 * designation within it) may see, rather than us guessing a static mapping
 * from department name/key (those are free-text + a random suffix assigned
 * at creation — see department.service.ts createDepartment — so they can't
 * be reliably matched against this static config file).
 */
function NavItemsChecklist({ name = 'allowedNavIds', restrictToIds }) {
	const { control } = useFormContext();

	return (
		<Controller
			name={name}
			control={control}
			defaultValue={[]}
			render={({ field: { value, onChange } }) => {
				const selected = Array.isArray(value) ? value : [];

				function toggle(id) {
					if (selected.includes(id)) {
						onChange(selected.filter((existingId) => existingId !== id));
					} else {
						onChange([...selected, id]);
					}
				}

				return (
					<div className="flex flex-col gap-16">
						{navigationConfig.map((group) => {
							const children = (group.children ?? []).filter(
								(child) => !restrictToIds || restrictToIds.includes(child.id)
							);

							if (children.length === 0) {
								return null;
							}

							return (
								<div key={group.id}>
									<Typography className="font-semibold text-14 mb-4">{group.title}</Typography>
									<FormGroup className="pl-16">
										{children.map((child) => (
											<FormControlLabel
												key={child.id}
												control={
													<Checkbox
														size="small"
														checked={selected.includes(child.id)}
														onChange={() => toggle(child.id)}
													/>
												}
												label={child.title}
											/>
										))}
									</FormGroup>
								</div>
							);
						})}
					</div>
				);
			}}
		/>
	);
}

export default NavItemsChecklist;
