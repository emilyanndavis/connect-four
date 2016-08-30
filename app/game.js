angular.module('con4', [])
	.controller('GameController', function($scope, $timeout){

		this.$onInit = function(){
			$scope.newGame();
		}
		
		$scope.newGame = function(){
			 $scope.victory = false;
			 $scope.grid = buildGrid();
			 // This is connect 4 so red plays first
			 $scope.activePlayer = 'red';
		}
		
		function buildGrid(){
			var grid = [];
			for (var r = 0; r < 6; r++) {
				var row = [];
				for (var c = 0; c < 7; c++){
					row.push({row: r, col: c});
				}
				grid.push(row);
			}
			return grid;
		}
		
		$scope.dropToken = function(col){
			//Column is full no space available
			if($scope.victory || $scope.grid[0][col].hasToken){
				if ($scope.activePlayer == 'black') {
					console.log('choose a new column, computer!')
					col = chooseColumn();
					return $scope.dropToken(col);
				}
				return;
			}
			
			var row = checkSouth(0, col);
			var cell = $scope.grid[row][col];

			var delay = 0;
			if ($scope.activePlayer == 'black') {
				delay = 1000;
			}
			$timeout(function(){
				cell.hasToken = true;
				cell.color = $scope.activePlayer;				
				checkVictory(cell);
				endTurn();
			}, delay);
			
		}
		
		function checkSouth(row, col){

			//Base case 1 found south Token return row - 1 to go back one step
			if ($scope.grid[row][col].hasToken) {
				return row - 1;
			} 
			
			//base case 2 reached bottom of grid return row or 5
			if (row === $scope.grid.length - 1) {
				return row;
			}
			
			/**
			 * if neither base case 
			 * (***increment row***, then return checkSouth())
			 * make sure to pass the arguments through
			 */
			return checkSouth(row + 1, col);

		}
		
		function checkVictory(cell){

			var horizontalMatches = 0;
			//Check Horizontal
			horizontalMatches += checkNextCell(cell, 0, 'left');
			horizontalMatches += checkNextCell(cell, 0, 'right');
			
			//Check Vertical
			var verticalMatches = 0;
			verticalMatches += checkNextCell(cell, 0, 'down');
			
			//Check Diag LeftUp and RightDown
			var diagLeft = 0;
			diagLeft += checkNextCell(cell, 0, 'diagUpLeft');
			diagLeft += checkNextCell(cell, 0, 'diagDownRight');
			
			//Check Diag RightUp and LeftDown
			var diagRight = 0;
			diagRight += checkNextCell(cell, 0, 'diagUpRight');
			diagRight += checkNextCell(cell, 0, 'diagDownLeft');
			
			if(verticalMatches >= 3 || horizontalMatches >= 3 || diagLeft >= 3 || diagRight >= 3){
				$scope.victory = true;
				$scope.victor = cell.color;
			}
		}
		
		function getNextCell(cell, direction){

			var nextRow = cell.row;
			var nextCol = cell.col;

			switch (direction) {
				case 'down':
					nextRow += 1;
					break;
				case 'diagDownRight':
					nextRow += 1;
					nextCol += 1;
					break;
				case 'diagDownLeft':
					nextRow += 1;
					nextCol -= 1;
					break;			
				case 'right':
					nextCol += 1;
					break;
				case 'diagUpRight':
					nextRow -= 1;
					nextCol += 1;
					break;
				case 'left':
					nextCol -= 1;
					break;
				case 'diagUpLeft':
					nextRow -= 1;
					nextCol -= 1;
					break;
			}

			if (nextRow < 0 || nextRow > $scope.grid.length - 1 || nextCol > $scope.grid[0].length - 1) {
				return null;
			}

			// console.log({direction: direction, row: $scope.grid[nextRow][nextCol].row, col: $scope.grid[nextRow][nextCol].col});			
			return $scope.grid[nextRow][nextCol];

		}
		
		function checkNextCell(cell, matches, direction){
			
			 var nextCell = getNextCell(cell, direction);

			 if (nextCell && nextCell.hasToken && nextCell.color === cell.color) {
				 matches++;
				 return checkNextCell(nextCell, matches, direction);
			 }
			 return matches;
			 		
		}
		
		function endTurn(){

			if ($scope.victory) {
				return;
			}
			if ($scope.activePlayer == 'red') {
				$scope.activePlayer = 'black';
				playComputerTurn();
			} else if ($scope.activePlayer == 'black') {
				$scope.activePlayer = 'red';
			}

		}

		function playComputerTurn() {

			var col = Math.floor(Math.random() * $scope.grid[0].length);
			// console.log(col);
			$scope.dropToken(col);

		}

		function chooseColumn(){
			var col = Math.floor(Math.random() * $scope.grid[0].length);
			console.log('new column: ' + col);
			return col;
		}

	});