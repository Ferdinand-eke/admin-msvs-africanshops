import Hidden from '@mui/material/Hidden';
import { styled } from '@mui/material/styles';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { selectFuseCurrentLayoutConfig } from '@fuse/core/FuseSettings/fuseSettingsSlice';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { navbarCloseMobile, selectFuseNavbar } from 'app/theme-layouts/shared-components/navbar/navbarSlice';
import { selectUser } from 'src/app/auth/user/store/userSlice';
import NavbarStyle1Content from './NavbarStyle1Content';

const navbarWidth = 280;
const StyledNavBar = styled('div')(({ theme, open, position }) => ({
	minWidth: navbarWidth,
	width: navbarWidth,
	maxWidth: navbarWidth,
	...(!open && {
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.leavingScreen
		}),
		...(position === 'left' && {
			marginLeft: `-${navbarWidth}px`
		}),
		...(position === 'right' && {
			marginRight: `-${navbarWidth}px`
		})
	}),
	...(open && {
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen
		})
	})
}));
const StyledNavBarMobile = styled(SwipeableDrawer)(() => ({
	'& .MuiDrawer-paper': {
		minWidth: navbarWidth,
		width: navbarWidth,
		maxWidth: navbarWidth
	}
}));

/**
 * The navbar style 1.
 */

function NavbarStyle1() {
	const user = useAppSelector(selectUser);
	const dispatch = useAppDispatch();
	const config = useAppSelector(selectFuseCurrentLayoutConfig);
	const navbar = useAppSelector(selectFuseNavbar);

	// console.log("SIDDBAR-USER", user)

	// Bug fix (2026-07-22): role.toString() === 'admin' was an exact-string
	// check from when `role` was always a single-tag value. transformAdminUser
	// (src/app/auth/transformAdminUser.js) now legitimately appends
	// 'super-admin'/'geo-asset'/'civic-operator' onto the role array for
	// privileged admins, so e.g. ['admin', 'super-admin'].toString() ===
	// 'admin,super-admin' — never equal to 'admin' — which silently hid the
	// entire sidebar for every super-admin/geo-asset/civic-operator account
	// while plain staff admins (role: ['admin']) kept working. Every admin
	// always carries the base 'admin' tag, so check for its presence instead.
	const isAdmin = Array.isArray(user?.role) ? user.role.includes('admin') : user?.role === 'admin';

	return (
		<>
			<Hidden lgDown>
				{isAdmin && (
					<StyledNavBar
						className="sticky top-0 z-20 h-screen flex-auto shrink-0 flex-col overflow-hidden shadow"
						open={navbar.open}
						position={config.navbar.position}
					>
						<NavbarStyle1Content />
					</StyledNavBar>
				)}
			</Hidden>

			<Hidden lgUp>
				{isAdmin && (
					<StyledNavBarMobile
						classes={{
							paper: 'flex-col flex-auto h-full'
						}}
						anchor={config.navbar.position}
						variant="temporary"
						open={navbar.mobileOpen}
						onClose={() => dispatch(navbarCloseMobile())}
						onOpen={() => {}}
						disableSwipeToOpen
						ModalProps={{
							keepMounted: true // Better open performance on mobile.
						}}
					>
						<NavbarStyle1Content />
					</StyledNavBarMobile>
				)}
			</Hidden>
		</>
	);
}

export default NavbarStyle1;
